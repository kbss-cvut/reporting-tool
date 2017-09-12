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
package cz.cvut.kbss.reporting.dto;

import cz.cvut.kbss.reporting.util.Constants;
import org.junit.Test;

import java.net.URI;

import static org.junit.Assert.assertNotEquals;

public class ReportRevisionInfoTest {

    @Test
    public void twoRevisionInfosWithSameRevisionButDifferentReportsAreDifferent() {
        final ReportRevisionInfo first = new ReportRevisionInfo();
        first.setUri(URI.create("http://reportOne"));
        first.setKey("12345");
        first.setRevision(Constants.INITIAL_REVISION);

        final ReportRevisionInfo second = new ReportRevisionInfo();
        second.setUri(URI.create("http://reportTwo"));
        second.setKey("54321");
        second.setRevision(Constants.INITIAL_REVISION);
        assertNotEquals(first, second);
        assertNotEquals(first.hashCode(), second.hashCode());
    }
}