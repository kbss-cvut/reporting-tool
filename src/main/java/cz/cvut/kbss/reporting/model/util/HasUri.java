package cz.cvut.kbss.reporting.model.util;

import java.net.URI;

/**
 * This is just a convenience interface which is implemented by all entities.
 * <p>
 * It simplifies testing, because we can reuse e.g. collection equality method, which goes over URIs instead of relying
 * on equals/hashCode being overridden.
 * <p>
 * In the future, this should be replaced by an abstract mapped superclass with an URI field representing the identifier
 * (as is usual in JPA models).
 */
public interface HasUri {

    URI getUri();
}
