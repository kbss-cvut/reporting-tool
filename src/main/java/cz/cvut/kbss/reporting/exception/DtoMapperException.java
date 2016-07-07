package cz.cvut.kbss.reporting.exception;

/**
 * Thrown if an error occurs when mapping entity to DTO or vice versa.
 */
public class DtoMapperException extends RuntimeException {

    public DtoMapperException(String message) {
        super(message);
    }

    public DtoMapperException(Throwable cause) {
        super(cause);
    }
}
