package cz.cvut.kbss.reporting.persistence;

/**
 * General exception marking an error in the persistence layer.
 */
public class PersistenceException extends RuntimeException {

    public PersistenceException() {
    }

    public PersistenceException(String message) {
        super(message);
    }

    public PersistenceException(String message, Throwable cause) {
        super(message, cause);
    }

    public PersistenceException(Throwable cause) {
        super(cause);
    }
}
