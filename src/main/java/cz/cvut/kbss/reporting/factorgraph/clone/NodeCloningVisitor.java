package cz.cvut.kbss.reporting.factorgraph.clone;

import cz.cvut.kbss.reporting.factorgraph.FactorGraphItem;
import cz.cvut.kbss.reporting.factorgraph.FactorGraphNodeVisitor;
import cz.cvut.kbss.reporting.model.Event;
import cz.cvut.kbss.reporting.model.Occurrence;

import java.net.URI;
import java.util.Map;

public class NodeCloningVisitor implements FactorGraphNodeVisitor {

    private final Map<URI, FactorGraphItem> instanceMap;

    public NodeCloningVisitor(Map<URI, FactorGraphItem> instanceMap) {
        this.instanceMap = instanceMap;
    }

    @Override
    public void visit(Occurrence occurrence) {
        if (!instanceMap.containsKey(occurrence.getUri())) {
            final Occurrence clone = new Occurrence(occurrence);
            instanceMap.put(occurrence.getUri(), clone);
        }
    }

    @Override
    public void visit(Event event) {
        if (!instanceMap.containsKey(event.getUri())) {
            final Event clone = new Event(event);
            instanceMap.put(event.getUri(), clone);
        }
    }
}
