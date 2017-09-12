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
package cz.cvut.kbss.reporting.service.repository;

import cz.cvut.kbss.reporting.model.Occurrence;
import cz.cvut.kbss.reporting.model.OccurrenceReport;
import cz.cvut.kbss.reporting.persistence.dao.OccurrenceDao;
import cz.cvut.kbss.reporting.persistence.dao.OccurrenceReportDao;
import cz.cvut.kbss.reporting.persistence.dao.OwlKeySupportingDao;
import cz.cvut.kbss.reporting.service.OccurrenceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Objects;

@Service
public class RepositoryOccurrenceService extends KeySupportingRepositoryService<Occurrence>
        implements OccurrenceService {

    @Autowired
    private OccurrenceDao occurrenceDao;

    @Autowired
    private OccurrenceReportDao reportDao;

    @Override
    protected OwlKeySupportingDao<Occurrence> getPrimaryDao() {
        return occurrenceDao;
    }

    @Override
    public OccurrenceReport findByOccurrence(Occurrence occurrence) {
        Objects.requireNonNull(occurrence);
        return reportDao.findByOccurrence(occurrence);
    }
}
