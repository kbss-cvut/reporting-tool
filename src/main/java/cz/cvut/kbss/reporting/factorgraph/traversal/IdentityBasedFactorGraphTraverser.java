package cz.cvut.kbss.reporting.factorgraph.traversal;

import cz.cvut.kbss.reporting.factorgraph.FactorGraphEdgeVisitor;
import cz.cvut.kbss.reporting.factorgraph.FactorGraphItem;
import cz.cvut.kbss.reporting.factorgraph.FactorGraphNodeVisitor;

import java.util.IdentityHashMap;
import java.util.Map;

/**
 * This traverser uses traversed items' identity to determine whether they have been visited or not.
 * <p>
 * This is suitable for factor graphs which may not have been persisted, yet.
 */
public class IdentityBasedFactorGraphTraverser extends FactorGraphTraverser {

    private Map<Object, Object> visited;

    public IdentityBasedFactorGraphTraverser(FactorGraphNodeVisitor nodeVisitor,
                                             FactorGraphEdgeVisitor factorGraphEdgeVisitor) {
        super(nodeVisitor, factorGraphEdgeVisitor);
    }

    @Override
    void resetVisited() {
        this.visited = new IdentityHashMap<>();
    }

    @Override
    boolean isVisited(FactorGraphItem item) {
        return visited.containsKey(item);
    }

    @Override
    void markAsVisited(FactorGraphItem item) {
        visited.put(item, null);
    }
}
