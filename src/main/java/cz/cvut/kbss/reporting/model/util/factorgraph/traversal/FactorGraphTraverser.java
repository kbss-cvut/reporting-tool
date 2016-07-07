/**
 * Copyright (C) 2016 Czech Technical University in Prague
 *
 * This program is free software: you can redistribute it and/or modify it under
 * the terms of the GNU General Public License as published by the Free Software
 * Foundation, either version 3 of the License, or (at your option) any
 * later version.
 *
 * This program is distributed in the hope that it will be useful, but WITHOUT
 * ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
 * FOR A PARTICULAR PURPOSE.  See the GNU General Public License for more
 * details. You should have received a copy of the GNU General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
 */
package cz.cvut.kbss.reporting.model.util.factorgraph.traversal;

import cz.cvut.kbss.reporting.model.Event;
import cz.cvut.kbss.reporting.model.Occurrence;
import cz.cvut.kbss.reporting.model.Vocabulary;
import cz.cvut.kbss.reporting.model.util.EventPositionComparator;
import cz.cvut.kbss.reporting.model.util.factorgraph.FactorGraphEdgeVisitor;
import cz.cvut.kbss.reporting.model.util.factorgraph.FactorGraphItem;
import cz.cvut.kbss.reporting.model.util.factorgraph.FactorGraphNodeVisitor;

import java.net.URI;
import java.util.HashSet;
import java.util.Set;
import java.util.TreeSet;

/**
 * Traverses the factor graph, using the specified visitors on corresponding nodes.
 */
public class FactorGraphTraverser {

    private static final URI HAS_PART_URI = URI.create(Vocabulary.s_p_has_part);

    private EventPositionComparator childEventComparator = new EventPositionComparator();

    private FactorGraphNodeVisitor nodeVisitor;
    private FactorGraphEdgeVisitor factorGraphEdgeVisitor;

    public FactorGraphTraverser(FactorGraphNodeVisitor nodeVisitor, FactorGraphEdgeVisitor factorGraphEdgeVisitor) {
        this.nodeVisitor = nodeVisitor;
        this.factorGraphEdgeVisitor = factorGraphEdgeVisitor;
    }

    public void setNodeVisitor(FactorGraphNodeVisitor nodeVisitor) {
        this.nodeVisitor = nodeVisitor;
    }

    public void setFactorGraphEdgeVisitor(FactorGraphEdgeVisitor factorGraphEdgeVisitor) {
        this.factorGraphEdgeVisitor = factorGraphEdgeVisitor;
    }

    /**
     * Traverses factor graph rooted in the specified {@link Occurrence}.
     *
     * @param root Factor graph root
     */
    public void traverse(Occurrence root) {
        final Set<URI> visited = new HashSet<>();
        if (nodeVisitor != null) {
            nodeVisitor.visit(root);
        }
        visited.add(root.getUri());
        if (root.getChildren() != null) {
            root.setChildren(sortChildren(root.getChildren()));
            for (Event e : root.getChildren()) {
                if (factorGraphEdgeVisitor != null) {
                    factorGraphEdgeVisitor.visit(root.getUri(), e.getUri(), HAS_PART_URI);
                }
                traverse(e, visited);
            }
        }
        traverseFactors(root, visited);
    }

    private void traverseFactors(FactorGraphItem item, Set<URI> visited) {
        if (item.getFactors() != null) {
            item.getFactors().forEach(f -> {
                if (factorGraphEdgeVisitor != null) {
                    // Assuming there is exactly one factor type
                    assert f.getTypes().size() == 1;
                    factorGraphEdgeVisitor.visit(f.getEvent().getUri(), item.getUri(), f.getTypes().iterator().next());
                }
                traverse(f.getEvent(), visited);
            });
        }
    }

    private void traverse(Event event, Set<URI> visited) {
        if (visited.contains(event.getUri())) {
            return;
        }
        if (nodeVisitor != null) {
            nodeVisitor.visit(event);
        }
        visited.add(event.getUri());
        if (event.getChildren() != null) {
            event.setChildren(sortChildren(event.getChildren()));
            event.getChildren().forEach(e -> {
                if (factorGraphEdgeVisitor != null) {
                    factorGraphEdgeVisitor.visit(event.getUri(), e.getUri(), HAS_PART_URI);
                }
                traverse(e, visited);
            });
        }
        traverseFactors(event, visited);
    }

    private Set<Event> sortChildren(Set<Event> children) {
        final Set<Event> sortedChildren = new TreeSet<>(childEventComparator);
        sortedChildren.addAll(children);
        return sortedChildren;
    }
}
