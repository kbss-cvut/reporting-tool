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
package cz.cvut.kbss.reporting.service;

import cz.cvut.kbss.reporting.dto.ReportRevisionInfo;
import cz.cvut.kbss.reporting.dto.reportlist.ReportDto;
import cz.cvut.kbss.reporting.model.LogicalDocument;
import cz.cvut.kbss.reporting.service.cache.ReportCache;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * Report caching version of the report business service.
 * <p>
 * It decorates the {@link MainReportService} with caching capabilities.
 */
@Service("cachingReportBusinessService")
public class CachingReportBusinessService implements ReportBusinessService {

    @Autowired
    private ReportCache reportCache;

    @Autowired
    private ReportBusinessService reportService;

    @Override
    public List<ReportDto> findAll() {
        if (reportCache.isInitialized()) {
            return reportCache.getAll();
        }
        final List<ReportDto> reports = reportService.findAll();
        reportCache.initialize(reports);
        return reports;
    }

    @Override
    public <T extends LogicalDocument> void persist(T report) {
        reportService.persist(report);
        reportCache.put(report.toReportDto());
    }

    @Override
    public <T extends LogicalDocument> void update(T report) {
        reportService.update(report);
        reportCache.put(report.toReportDto());
    }

    @Override
    public <T extends LogicalDocument> T findByKey(String key) {
        return reportService.findByKey(key);
    }

    @Override
    public <T extends LogicalDocument> T findLatestRevision(Long fileNumber) {
        return reportService.findLatestRevision(fileNumber);
    }

    @Override
    public void removeReportChain(Long fileNumber) {
        reportService.removeReportChain(fileNumber);
        reportCache.evict(fileNumber);
    }

    @Override
    public List<ReportRevisionInfo> getReportChainRevisions(Long fileNumber) {
        return reportService.getReportChainRevisions(fileNumber);
    }

    @Override
    public <T extends LogicalDocument> T createNewRevision(Long fileNumber) {
        final T newRevision = reportService.createNewRevision(fileNumber);
        reportCache.put(newRevision.toReportDto());
        return newRevision;
    }

    @Override
    public <T extends LogicalDocument> T findRevision(Long fileNumber, Integer revision) {
        return reportService.findRevision(fileNumber, revision);
    }

    @Override
    public <T extends LogicalDocument> void transitionToNextPhase(T report) {
        reportService.transitionToNextPhase(report);
        reportCache.put(report.toReportDto());
    }
}
