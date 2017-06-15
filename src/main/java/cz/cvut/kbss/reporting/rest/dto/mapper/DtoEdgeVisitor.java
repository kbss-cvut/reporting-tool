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
