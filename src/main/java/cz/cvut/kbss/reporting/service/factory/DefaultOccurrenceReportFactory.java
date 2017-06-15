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
