package cz.cvut.kbss.reporting.service;

import cz.cvut.kbss.reporting.model.Occurrence;
import cz.cvut.kbss.reporting.model.OccurrenceReport;

public interface OccurrenceService extends BaseService<Occurrence> {

    /**
     * Finds occurrence with the specified key.
     *
     * @param key Occurrence key
     * @return Matching instance or {@code null}, if none exists
     */
    Occurrence findByKey(String key);

    /**
     * Gets report related to the specified occurrence.
     *
     * @param occurrence Occurrence to find report for
     * @return Matching report, possibly {@code null}
     */
    OccurrenceReport findByOccurrence(Occurrence occurrence);
}
