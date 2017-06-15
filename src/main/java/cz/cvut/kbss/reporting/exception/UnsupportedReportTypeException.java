package cz.cvut.kbss.reporting.exception;

/**
 * Thrown for reports which are not supported by any service in the application.
 */
public class UnsupportedReportTypeException extends RuntimeException {

    public UnsupportedReportTypeException(String message) {
        super(message);
    }
}
