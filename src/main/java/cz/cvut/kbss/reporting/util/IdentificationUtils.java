/**
 * Copyright (C) 2016 Czech Technical University in Prague
 *
 * This program is free software: you can redistribute it and/or modify it under
 * the terms of the GNU General Public License as published by the Free Software
 * Foundation, either version 3 of the License, or (at your option) any
 * later version.
 *
 * This program is distributed in the hope that it will be useful, but WITHOUT
 * ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
 * FOR A PARTICULAR PURPOSE.  See the GNU General Public License for more
 * details. You should have received a copy of the GNU General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
 */
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
