/**
 * Copyright (C) 2017 Czech Technical University in Prague
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

import org.jsoup.Jsoup;

import java.util.Objects;

/**
 * Utility class for document conversion between various format.
 */
public class DocConverter {

    /**
     * Converts HTML represented as string to plain text by removing all HTML tags and keeping only the text.
     *
     * @param html The HTML to convert
     * @return Text content of the input document
     */
    public String convertHtml2PlainText(String html) {
        Objects.requireNonNull(html);
        final org.jsoup.nodes.Document doc = Jsoup.parse(html);
        return doc.body().text();
    }
}
