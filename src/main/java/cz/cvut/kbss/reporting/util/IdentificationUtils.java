package cz.cvut.kbss.reporting.util;

import cz.cvut.kbss.reporting.model.LogicalDocument;

import java.util.Objects;
import java.util.Random;

public class IdentificationUtils {

    private static final int RANDOM_BOUND = 10000;

    private static final Random RANDOM = new Random();

    private IdentificationUtils() {
        throw new AssertionError();
    }

    /**
     * Generates a pseudo-unique OWL key using current system time and a random generator.
     *
     * @return OWL key
     */
    public static String generateKey() {
        String key = Long.toString(System.nanoTime());
        return key.concat(Integer.toString(RANDOM.nextInt(RANDOM_BOUND)));
    }

    /**
     * Generates a file number (used to identify report chains).
     * <p>
     * Currently, the file numbers are simply current system time in milliseconds. A more elaborate strategy can be
     * employed if necessary.
     *
     * @return New file number
     */
    public static Long generateFileNumber() {
        return System.currentTimeMillis();
    }

    /**
     * Sets required identification fields of the specified document.
     * <p>
     * This currently included its key and file number. If the fields are already set, they are not modified.
     *
     * @param doc The document to set fields on
     */
    public static void generateIdentificationFields(LogicalDocument doc) {
        Objects.requireNonNull(doc);
        if (doc.getKey() == null) {
            doc.setKey(generateKey());
        }
        if (doc.getFileNumber() == null) {
            doc.setFileNumber(generateFileNumber());
        }
    }
}
