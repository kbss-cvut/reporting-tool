package cz.cvut.kbss.reporting.service.factory;

import cz.cvut.kbss.reporting.model.InitialReport;
import cz.cvut.kbss.reporting.model.OccurrenceReport;

/**
 * Creates {@link cz.cvut.kbss.reporting.model.OccurrenceReport} instances.
 */
public interface OccurrenceReportFactory {

    /**
     * Creates new {@link OccurrenceReport} based on the specified {@link InitialReport}.
     * <p>
     * The new instance is not persisted, so it has to be run through the regular report lifecycle.
     *
     * @param initialReport The initial report to start with
     * @return Occurrence report instance
     */
    OccurrenceReport createFromInitialReport(InitialReport initialReport);
}
