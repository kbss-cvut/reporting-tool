package cz.cvut.kbss.reporting.model.util.factorgraph;

import cz.cvut.kbss.inbas.reporting.model.Event;
import cz.cvut.kbss.inbas.reporting.model.Occurrence;

/**
 * Visits nodes during factor graph traversal.
 */
public interface FactorGraphNodeVisitor {

    void visit(Occurrence occurrence);

    void visit(Event event);
}
