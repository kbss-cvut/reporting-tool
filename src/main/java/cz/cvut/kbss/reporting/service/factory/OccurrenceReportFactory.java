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
