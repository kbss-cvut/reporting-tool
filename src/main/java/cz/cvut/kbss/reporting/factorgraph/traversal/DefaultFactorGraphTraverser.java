/**
 * Copyright (C) 2017 Czech Technical University in Prague
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
package cz.cvut.kbss.reporting.factorgraph.traversal;

import cz.cvut.kbss.reporting.factorgraph.FactorGraphEdgeVisitor;
import cz.cvut.kbss.reporting.factorgraph.FactorGraphItem;
import cz.cvut.kbss.reporting.factorgraph.FactorGraphNodeVisitor;

import java.net.URI;
import java.util.HashSet;
import java.util.Set;

/**
 * This traverser uses the traversed items' URIs to determine whether they have been already visited or not.
 */
public class DefaultFactorGraphTraverser extends FactorGraphTraverser {

    private Set<URI> visited;

    public DefaultFactorGraphTraverser(FactorGraphNodeVisitor nodeVisitor,
                                       FactorGraphEdgeVisitor factorGraphEdgeVisitor) {
        super(nodeVisitor, factorGraphEdgeVisitor);
    }

    @Override
    void resetVisited() {
        this.visited = new HashSet<>();
    }

    @Override
    boolean isVisited(FactorGraphItem item) {
        return visited.contains(item.getUri());
    }

    @Override
    void markAsVisited(FactorGraphItem item) {
        visited.add(item.getUri());
    }
}
