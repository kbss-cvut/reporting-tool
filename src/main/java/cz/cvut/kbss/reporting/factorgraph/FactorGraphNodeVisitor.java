package cz.cvut.kbss.reporting.factorgraph;

import cz.cvut.kbss.reporting.model.Event;
import cz.cvut.kbss.reporting.model.Occurrence;

/**
 * Visits nodes during factor graph traversal.
 */
public interface FactorGraphNodeVisitor {

    void visit(Occurrence occurrence);

    void visit(Event event);
}
