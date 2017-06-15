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
package cz.cvut.kbss.reporting.service.factory;

import cz.cvut.kbss.reporting.environment.generator.OccurrenceReportGenerator;
import cz.cvut.kbss.reporting.model.InitialReport;
import cz.cvut.kbss.reporting.model.OccurrenceReport;
import org.junit.Test;

import static org.junit.Assert.*;

public class DefaultOccurrenceReportFactoryTest {

    private DefaultOccurrenceReportFactory reportFactory = new DefaultOccurrenceReportFactory();

    @Test
    public void createFromInitialCreatesNewReportFromSpecifiedInitialReport() {
        final long startTime = System.currentTimeMillis();
        final InitialReport initialReport = OccurrenceReportGenerator.generateInitialReport();
        final OccurrenceReport result = reportFactory.createFromInitialReport(initialReport);
        assertNotNull(result);
        assertEquals(initialReport, result.getInitialReport());
        assertNotNull(result.getOccurrence());
        assertNotNull(result.getOccurrence().getStartTime());
        assertNotNull(result.getOccurrence().getEndTime());
        assertEquals(result.getOccurrence().getStartTime(), result.getOccurrence().getEndTime());
        assertTrue(startTime <= result.getOccurrence().getStartTime().getTime());
        assertTrue(result.getOccurrence().getStartTime().getTime() <= System.currentTimeMillis());
    }
}