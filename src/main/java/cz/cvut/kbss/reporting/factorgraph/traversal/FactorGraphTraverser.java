package cz.cvut.kbss.reporting.factorgraph.traversal;

import cz.cvut.kbss.reporting.factorgraph.FactorGraphEdgeVisitor;
import cz.cvut.kbss.reporting.factorgraph.FactorGraphItem;
import cz.cvut.kbss.reporting.factorgraph.FactorGraphNodeVisitor;
import cz.cvut.kbss.reporting.model.Event;
import cz.cvut.kbss.reporting.model.Occurrence;
import cz.cvut.kbss.reporting.model.Vocabulary;

import java.net.URI;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;
import java.util.TreeSet;

/**
 * Traverses the factor graph, using the specified visitors on corresponding nodes.
 */
public abstract class FactorGraphTraverser {

    private static final URI HAS_PART_URI = URI.create(Vocabulary.s_p_has_part);

    private final List<FactorGraphNodeVisitor> nodeVisitors = new ArrayList<>(2);
    private FactorGraphEdgeVisitor factorGraphEdgeVisitor;

    FactorGraphTraverser(FactorGraphNodeVisitor nodeVisitor, FactorGraphEdgeVisitor factorGraphEdgeVisitor) {
        if (nodeVisitor != null) {
            nodeVisitors.add(nodeVisitor);
        }
        this.factorGraphEdgeVisitor = factorGraphEdgeVisitor;
    }

    public void registerNodeVisitor(FactorGraphNodeVisitor nodeVisitor) {
        nodeVisitors.add(nodeVisitor);
    }

    public void setFactorGraphEdgeVisitor(FactorGraphEdgeVisitor factorGraphEdgeVisitor) {
        this.factorGraphEdgeVisitor = factorGraphEdgeVisitor;
    }

    /**
     * Traverses factor graph rooted in the specified {@link Occurrence}.
     *
     * @param root Factor graph root
     */
    public void traverse(FactorGraphItem root) {
        resetVisited();
        traverseImpl(root);
    }

    private void traverseFactors(FactorGraphItem item) {
        if (item.getFactors() != null) {
            item.getFactors().forEach(f -> {
                if (factorGraphEdgeVisitor != null) {
                    // Assuming there is exactly one factor type
                    assert f.getTypes().size() == 1;
                    factorGraphEdgeVisitor
                            .visit(f.getUri(), f.getEvent().getUri(), item.getUri(), f.getTypes().iterator().next());
                }
                traverseImpl(f.getEvent());
            });
        }
    }

    private void traverseImpl(FactorGraphItem item) {
        if (isVisited(item)) {
            return;
        }
        if (nodeVisitors != null) {
            nodeVisitors.forEach(item::accept);
        }
        markAsVisited(item);
        if (item.getChildren() != null) {
            item.setChildren(sortChildren(item.getChildren()));
            item.getChildren().forEach(e -> {
                if (factorGraphEdgeVisitor != null) {
                    factorGraphEdgeVisitor.visit(null, item.getUri(), e.getUri(), HAS_PART_URI);
                }
                traverseImpl(e);
            });
        }
        traverseFactors(item);
    }

    private Set<Event> sortChildren(Set<Event> children) {
        final Set<Event> sortedChildren = new TreeSet<>();
        sortedChildren.addAll(children);
        return sortedChildren;
    }

    abstract void resetVisited();

    abstract boolean isVisited(FactorGraphItem item);

    abstract void markAsVisited(FactorGraphItem item);
}
