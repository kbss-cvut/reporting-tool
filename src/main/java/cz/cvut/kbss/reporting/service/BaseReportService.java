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
package cz.cvut.kbss.reporting.service;

import cz.cvut.kbss.reporting.exception.NotFoundException;
import cz.cvut.kbss.reporting.model.LogicalDocument;

/**
 * Base interface which every report-specific service has to implement.
 *
 * @param <T> Report type
 */
interface BaseReportService<T extends LogicalDocument> extends BaseService<T> {

    /**
     * Finds instance with the specified key.
     *
     * @param key Instance key
     * @return Matching instance or {@code null}, if none exists
     */
    T findByKey(String key);

    /**
     * Gets report with latest revision in report chain with the specified file number.
     *
     * @param fileNumber Report chain identifier
     * @return Latest revision report or {@code null} if there is no matching report chain
     */
    T findLatestRevision(Long fileNumber);

    /**
     * Removes all reports in a report chain with the specified file number.
     * <p>
     * Does nothing if the report chain does not exist.
     *
     * @param fileNumber Report chain identifier
     */
    void removeReportChain(Long fileNumber);

    /**
     * Creates new report revision in report chain with the specified file number.
     *
     * @param fileNumber Report chain identifier
     * @return The new revision
     * @throws NotFoundException If there is no report chain with the specified file number
     */
    T createNewRevision(Long fileNumber);

    /**
     * Gets report in report chain with the specified file number and with the specified revision number.
     *
     * @param fileNumber Report chain identifier
     * @param revision   Revision number
     * @return Matching report or {@code null}
     */
    T findRevision(Long fileNumber, Integer revision);

    /**
     * Transitions the specified report to the next phase (if possible).
     * <p>
     * If the report has no phase or it is in the latest possible phase, no action occurs.
     *
     * @param report The report to transition
     */
    void transitionToNextPhase(T report);
}
