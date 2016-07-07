package cz.cvut.kbss.reporting.service;

import cz.cvut.kbss.reporting.model.Occurrence;
import cz.cvut.kbss.reporting.model.OccurrenceReport;

import java.util.Collection;

public interface OccurrenceService extends BaseService<Occurrence> {

    /**
     * Finds occurrence with the specified key.
     *
     * @param key Occurrence key
     * @return Matching instance or {@code null}, if none exists
     */
    Occurrence findByKey(String key);

    /**
     * Gets reports related to the specified occurrence.
     *
     * @param occurrence Occurrence to find reports for
     * @return Collection of matching reports (possibly empty)
     */
    Collection<OccurrenceReport> getReports(Occurrence occurrence);
}
