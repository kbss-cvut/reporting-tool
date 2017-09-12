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
package cz.cvut.kbss.reporting.service.factory;

import cz.cvut.kbss.reporting.model.InitialReport;
import cz.cvut.kbss.reporting.model.Occurrence;
import cz.cvut.kbss.reporting.model.OccurrenceReport;

import java.util.Date;
import java.util.Objects;

public class DefaultOccurrenceReportFactory implements OccurrenceReportFactory {

    @Override
    public OccurrenceReport createFromInitialReport(InitialReport initialReport) {
        Objects.requireNonNull(initialReport);
        final OccurrenceReport report = new OccurrenceReport();
        report.setInitialReport(initialReport);
        final Occurrence occurrence = new Occurrence();
        final Date date = new Date();
        occurrence.setStartTime(date);
        occurrence.setEndTime(date);
        report.setOccurrence(occurrence);
        return report;
    }
}
