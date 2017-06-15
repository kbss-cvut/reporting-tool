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

import cz.cvut.kbss.reporting.environment.generator.OccurrenceReportGenerator;
import cz.cvut.kbss.reporting.model.OccurrenceReport;
import org.junit.Test;

import static org.junit.Assert.*;

public class IdentificationUtilsTest {

    @Test
    public void generateIdentificationFieldsSetsRequiredIdentificationFields() {
        final OccurrenceReport report = OccurrenceReportGenerator.generateOccurrenceReport(false);
        assertNull(report.getKey());
        assertNull(report.getFileNumber());
        IdentificationUtils.generateIdentificationFields(report);
        assertNotNull(report.getKey());
        assertNotNull(report.getFileNumber());
    }

    @Test
    public void generateIdentificationUtilsLeavesFieldsUnchangedIfTheyAreAlreadySet() {
        final OccurrenceReport report = OccurrenceReportGenerator.generateOccurrenceReport(true);
        report.setKey(IdentificationUtils.generateKey());
        final String origKey = report.getKey();
        final Long origFileNo = report.getFileNumber();
        IdentificationUtils.generateIdentificationFields(report);
        assertEquals(origKey, report.getKey());
        assertEquals(origFileNo, report.getFileNumber());
    }
}
