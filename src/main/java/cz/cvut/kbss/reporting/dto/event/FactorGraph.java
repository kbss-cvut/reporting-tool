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
package cz.cvut.kbss.reporting.dto.event;

import java.util.List;
import java.util.Set;

public class FactorGraph {

    private List<EventDto> nodes;

    private Set<FactorGraphEdge> edges;

    public List<EventDto> getNodes() {
        return nodes;
    }

    public void setNodes(List<EventDto> nodes) {
        this.nodes = nodes;
    }

    public Set<FactorGraphEdge> getEdges() {
        return edges;
    }

    public void setEdges(Set<FactorGraphEdge> edges) {
        this.edges = edges;
    }
}
