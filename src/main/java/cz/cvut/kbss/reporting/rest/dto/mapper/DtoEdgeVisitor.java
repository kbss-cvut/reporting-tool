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
package cz.cvut.kbss.reporting.rest.dto.mapper;

import cz.cvut.kbss.reporting.dto.event.EventDto;
import cz.cvut.kbss.reporting.dto.event.FactorGraphEdge;
import cz.cvut.kbss.reporting.factorgraph.FactorGraphEdgeVisitor;

import java.net.URI;
import java.util.LinkedHashSet;
import java.util.Map;
import java.util.Set;


class DtoEdgeVisitor implements FactorGraphEdgeVisitor {

    private final Map<URI, EventDto> nodeMap;

    private final Set<FactorGraphEdge> edges = new LinkedHashSet<>();

    DtoEdgeVisitor(Map<URI, EventDto> nodeMap) {
        this.nodeMap = nodeMap;
    }

    @Override
    public void visit(URI uri, URI from, URI to, URI type) {
        edges.add(new FactorGraphEdge(uri, nodeMap.get(from).getReferenceId(), nodeMap.get(to).getReferenceId(), type));
    }

    Set<FactorGraphEdge> getEdges() {
        return edges;
    }
}
