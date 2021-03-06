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
