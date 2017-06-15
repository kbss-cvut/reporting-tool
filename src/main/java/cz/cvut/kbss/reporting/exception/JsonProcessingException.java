package cz.cvut.kbss.reporting.exception;

/**
 * Thrown when an error occurs during processing of JSON or JSON-LD data.
 */
public class JsonProcessingException extends RuntimeException {

    public JsonProcessingException(String message) {
        super(message);
    }

    public JsonProcessingException(String message, Throwable cause) {
        super(message, cause);
    }

    public static JsonProcessingException createForInvalid(String json, Exception e) {
        return new JsonProcessingException("The specified JSON is not valid. JSON: " + json, e);
    }
}
