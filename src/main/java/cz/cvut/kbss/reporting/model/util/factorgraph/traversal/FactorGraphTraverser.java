package cz.cvut.kbss.reporting.model.util.factorgraph.traversal;

import cz.cvut.kbss.reporting.model.Event;
import cz.cvut.kbss.reporting.model.Occurrence;
import cz.cvut.kbss.reporting.model.Vocabulary;
import cz.cvut.kbss.reporting.model.util.factorgraph.FactorGraphEdgeVisitor;
import cz.cvut.kbss.reporting.model.util.factorgraph.FactorGraphItem;
import cz.cvut.kbss.reporting.model.util.factorgraph.FactorGraphNodeVisitor;

import java.net.URI;
import java.util.Set;
import java.util.TreeSet;

/**
 * Traverses the factor graph, using the specified visitors on corresponding nodes.
 */
public abstract class FactorGraphTraverser {

    private static final URI HAS_PART_URI = URI.create(Vocabulary.s_p_has_part);

    private FactorGraphNodeVisitor nodeVisitor;
    private FactorGraphEdgeVisitor factorGraphEdgeVisitor;

    FactorGraphTraverser(FactorGraphNodeVisitor nodeVisitor, FactorGraphEdgeVisitor factorGraphEdgeVisitor) {
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
                    factorGraphEdgeVisitor.visit(f.getEvent().getUri(), item.getUri(), f.getTypes().iterator().next());
                }
                traverseImpl(f.getEvent());
            });
        }
    }

    private void traverseImpl(FactorGraphItem item) {
        if (isVisited(item)) {
            return;
        }
        if (nodeVisitor != null) {
            item.accept(nodeVisitor);
        }
        markAsVisited(item);
        if (item.getChildren() != null) {
            item.setChildren(sortChildren(item.getChildren()));
            item.getChildren().forEach(e -> {
                if (factorGraphEdgeVisitor != null) {
                    factorGraphEdgeVisitor.visit(item.getUri(), e.getUri(), HAS_PART_URI);
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
