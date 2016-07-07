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
