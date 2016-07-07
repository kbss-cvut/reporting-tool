package cz.cvut.kbss.reporting.model.util.factorgraph;

import java.net.URI;

/**
 * Visits edges during factor graph traversal.
 */
public interface FactorGraphEdgeVisitor {

    /**
     * Visits edge specified by its source, target and type.
     *
     * @param from Edge source
     * @param to   Edge target
     * @param type Edge type
     */
    void visit(URI from, URI to, URI type);
}
