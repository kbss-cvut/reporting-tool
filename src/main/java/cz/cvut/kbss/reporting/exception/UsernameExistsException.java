package cz.cvut.kbss.reporting.exception;

/**
 * @author ledvima1
 */
public class UsernameExistsException extends RuntimeException {

    public UsernameExistsException() {
    }

    public UsernameExistsException(String message) {
        super(message);
    }

    public UsernameExistsException(String message, Throwable cause) {
        super(message, cause);
    }

    public UsernameExistsException(Throwable cause) {
        super(cause);
    }
}
