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
