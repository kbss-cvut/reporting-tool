package cz.cvut.kbss.reporting.service;

import cz.cvut.kbss.reporting.dto.ReportRevisionInfo;
import cz.cvut.kbss.reporting.dto.reportlist.ReportDto;
import cz.cvut.kbss.reporting.model.LogicalDocument;
import cz.cvut.kbss.reporting.service.cache.ReportCache;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Collection;
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
    public List<ReportDto> findAll(Collection<String> keys) {
        return reportService.findAll(keys);
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
