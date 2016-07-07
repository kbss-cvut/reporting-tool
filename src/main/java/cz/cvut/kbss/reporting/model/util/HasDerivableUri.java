package cz.cvut.kbss.reporting.model.util;

/**
 * Marker interface for entity classes with non-generated identifiers, which can be derived from their attributes.
 */
public interface HasDerivableUri extends HasUri {

    /**
     * Generates URI for this instance.
     * <p>
     * This method should be idempotent, i.e. calling it multiple times should always lead to the instance having the
     * same URI.
     */
    void generateUri();
}
