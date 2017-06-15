package cz.cvut.kbss.reporting.factorgraph;

import java.net.URI;

/**
 * Visits edges during factor graph traversal.
 */
public interface FactorGraphEdgeVisitor {

    /**
     * Visits edge specified by its source, target and type.
     *
     * @param uri  URI of the edge (if present). Optional
     * @param from Edge source
     * @param to   Edge target
     * @param type Edge type
     */
    void visit(URI uri, URI from, URI to, URI type);
}
