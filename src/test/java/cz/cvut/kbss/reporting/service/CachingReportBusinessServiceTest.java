package cz.cvut.kbss.reporting.service;

import cz.cvut.kbss.reporting.dto.ReportRevisionInfo;
import cz.cvut.kbss.reporting.dto.reportlist.OccurrenceReportDto;
import cz.cvut.kbss.reporting.dto.reportlist.ReportDto;
import cz.cvut.kbss.reporting.environment.generator.Generator;
import cz.cvut.kbss.reporting.environment.generator.OccurrenceReportGenerator;
import cz.cvut.kbss.reporting.environment.util.Environment;
import cz.cvut.kbss.reporting.model.LogicalDocument;
import cz.cvut.kbss.reporting.model.OccurrenceReport;
import cz.cvut.kbss.reporting.model.Person;
import cz.cvut.kbss.reporting.persistence.dao.OccurrenceReportDao;
import cz.cvut.kbss.reporting.service.cache.ReportCache;
import org.junit.Before;
import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import static org.junit.Assert.*;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;

public class CachingReportBusinessServiceTest extends BaseServiceTestRunner {

    @Autowired
    @Qualifier("cachingReportBusinessService")
    private ReportBusinessService reportService;

    @Autowired
    private ReportCache reportCache;

    @Autowired
    private OccurrenceReportDao occurrenceReportDao;

    @Autowired
    private OccurrenceReportService occurrenceReportService;

    private Person author;

    @Before
    public void setUp() {
        this.author = persistPerson();
        Environment.setCurrentUser(author);
    }

    @Test
    public void persistAddsReportIntoCache() {
        assertTrue(reportCache.getAll().isEmpty());
        final OccurrenceReport report = persistOccurrenceReport();

        final List<ReportDto> res = reportCache.getAll();
        assertEquals(1, res.size());
        assertEquals(report.getUri(), res.get(0).getUri());
    }

    private OccurrenceReport persistOccurrenceReport() {
        final OccurrenceReport report = OccurrenceReportGenerator.generateOccurrenceReport(false);
        reportService.persist(report);
        return report;
    }

    @Test
    public void updateReplacesPreviousInstanceInReportCache() {
        final OccurrenceReport report = persistOccurrenceReport();
        assertEquals(1, reportCache.getAll().size());
        final String summary = "Occurrence report summary.";
        report.setSummary(summary);
        reportService.update(report);

        final OccurrenceReportDto dto = (OccurrenceReportDto) reportCache.getAll().get(0);
        assertEquals(report.getUri(), dto.getUri());
        assertEquals(summary, dto.getSummary());
    }

    @Test
    public void removeReportChainRemovesInstanceFromReportCache() {
        final List<OccurrenceReport> chain = persistOccurrenceReportChain();
        reportCache.put(chain.get(chain.size() - 1).toReportDto());
        assertEquals(1, reportCache.getAll().size());
        final Long fileNumber = chain.get(0).getFileNumber();

        reportService.removeReportChain(fileNumber);
        assertTrue(reportCache.getAll().isEmpty());
    }

    private List<OccurrenceReport> persistOccurrenceReportChain() {
        final List<OccurrenceReport> chain = OccurrenceReportGenerator.generateOccurrenceReportChain(author);
        occurrenceReportDao.persist(chain);
        return chain;
    }

    @Test
    public void createNewRevisionReplacesInstanceInReportCache() {
        final List<OccurrenceReport> chain = persistOccurrenceReportChain();
        // Because we are persisting the chain outside MainReportService, the cache does not know about it
        reportCache.put(chain.get(chain.size() - 1).toReportDto());
        assertEquals(1, reportCache.getAll().size());

        final OccurrenceReport newRevision = reportService.createNewRevision(chain.get(0).getFileNumber());
        assertEquals(1, reportCache.getAll().size());
        final OccurrenceReportDto dto = (OccurrenceReportDto) reportCache.getAll().get(0);
        assertEquals(newRevision.getUri(), dto.getUri());
        assertEquals(newRevision.getRevision(), dto.getRevision());
    }

    @Test
    public void findAllPutsRetrievedReportsIntoCache() {
        // Once other report types are added, they should be added into this tests
        initReportChains();

        assertTrue(reportCache.getAll().isEmpty());
        final List<ReportDto> result = reportService.findAll();
        assertFalse(reportCache.getAll().isEmpty());
        assertEquals(result, reportCache.getAll());
    }

    @Test
    public void findAllRetrievesInstancesFromReportCache() {
        initReportChains();
        // First time will put the reports into cache
        reportService.findAll();
        reportService.findAll();
        // Two calls to service, but only one call to the DAO
        verify(occurrenceReportService).findAll();
    }

    /**
     * Generates report chains.
     *
     * @return List of latest revisions of the generated chains, ordered by date created descending
     */
    private List<LogicalDocument> initReportChains() {
        final List<LogicalDocument> latestRevisions = new ArrayList<>();
        for (int i = 0; i < Generator.randomInt(10); i++) {
            final List<OccurrenceReport> chain = persistOccurrenceReportChain();
            latestRevisions.add(chain.get(chain.size() - 1));
        }
        latestRevisions.sort((a, b) -> b.getDateCreated().compareTo(a.getDateCreated()));
        return latestRevisions;
    }

    @Test
    public void findAllAfterCacheEvictLoadsReportsFromRepository() throws Exception {
        initReportChains();
        assertTrue(reportCache.getAll().isEmpty());
        assertFalse(reportService.findAll().isEmpty());
        assertFalse(reportCache.getAll().isEmpty());
        reportCache.evict();
        assertTrue(reportCache.getAll().isEmpty());
        assertFalse(reportService.findAll().isEmpty());
        assertFalse(reportCache.getAll().isEmpty());
        verify(occurrenceReportService, times(2)).findAll();
    }

    @Test
    public void findAllReturnsAllReportsEvenWhenReportIsAddedIntoCacheAfterEvict() throws Exception {
        final List<LogicalDocument> reports = initReportChains();
        assertEquals(reports.size(), reportService.findAll().size());
        reportCache.evict();
        final OccurrenceReport added = OccurrenceReportGenerator.generateOccurrenceReport(false);
        reportService.persist(added);
        assertEquals(reports.size() + 1, reportService.findAll().size());
    }

    @Test
    public void phaseTransitionPutsUpdatedReportIntoCache() {
        final OccurrenceReport report = persistOccurrenceReport();
        reportCache.evict();
        reportService.transitionToNextPhase(report);
        final List<ReportDto> cached = reportCache.getAll();
        assertEquals(1, cached.size());
        assertEquals(report.getUri(), cached.get(0).getUri());
    }

    @Test
    public void findByKeyDelegatesCallToUnderlyingService() {
        final OccurrenceReport report = persistOccurrenceReport();
        assertEquals(report.getUri(), reportService.findByKey(report.getKey()).getUri());
    }

    @Test
    public void findLatestRevisionDelegatesCallToUnderlyingService() {
        final List<OccurrenceReport> chain = persistOccurrenceReportChain();
        assertEquals(chain.get(chain.size() - 1).getUri(),
                reportService.findLatestRevision(chain.get(0).getFileNumber()).getUri());
    }

    @Test
    public void findRevisionDelegatesCallToUnderlyingService() {
        final List<OccurrenceReport> chain = persistOccurrenceReportChain();
        final OccurrenceReport revision = chain.get(Generator.randomIndex(chain));
        assertEquals(revision.getUri(),
                reportService.findRevision(revision.getFileNumber(), revision.getRevision()).getUri());
    }

    @Test
    public void getReportChainRevisionsDelegatesCallToUnderlyingService() {
        final List<OccurrenceReport> chain = persistOccurrenceReportChain();
        final List<ReportRevisionInfo> revisions = reportService.getReportChainRevisions(chain.get(0).getFileNumber());
        assertEquals(chain.size(), revisions.size());
    }

    @Test
    public void findAllUsingKeysReadsReportsDirectlyFromDao() {
        final List<LogicalDocument> latestRevisions = initReportChains();
        final List<String> keys = latestRevisions.stream().map(LogicalDocument::getKey).collect(Collectors.toList());

        final List<ReportDto> result = reportService.findAll(keys);
        assertFalse(reportCache.isInitialized());
        assertEquals(keys.size(), result.size());
    }
}
