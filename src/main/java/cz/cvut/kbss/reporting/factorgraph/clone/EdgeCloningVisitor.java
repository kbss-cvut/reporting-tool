package cz.cvut.kbss.reporting.factorgraph.clone;

import cz.cvut.kbss.reporting.factorgraph.FactorGraphEdgeVisitor;
import cz.cvut.kbss.reporting.factorgraph.FactorGraphItem;
import cz.cvut.kbss.reporting.model.Event;
import cz.cvut.kbss.reporting.model.Factor;
import cz.cvut.kbss.reporting.model.Vocabulary;

import java.net.URI;
import java.util.Map;

public class EdgeCloningVisitor implements FactorGraphEdgeVisitor {

    private static final URI HAS_PART_URI = URI.create(Vocabulary.s_p_has_part);

    private final Map<URI, FactorGraphItem> instanceMap;

    public EdgeCloningVisitor(Map<URI, FactorGraphItem> instanceMap) {
        this.instanceMap = instanceMap;
    }

    @Override
    public void visit(URI uri, URI from, URI to, URI type) {
        final FactorGraphItem source = instanceMap.get(from);
        assert source != null;
        final FactorGraphItem target = instanceMap.get(to);
        assert target != null;
        if (type.equals(HAS_PART_URI)) {
            source.addChild((Event) target);
        } else {
            final Factor factor = new Factor();
            factor.setEvent((Event) source);
            factor.addType(type);
            target.addFactor(factor);
        }
    }
}
