package cz.cvut.kbss.reporting.persistence.dao;

import cz.cvut.kbss.reporting.dto.ReportRevisionInfo;
import cz.cvut.kbss.reporting.environment.generator.Generator;
import cz.cvut.kbss.reporting.environment.generator.OccurrenceReportGenerator;
import cz.cvut.kbss.reporting.model.OccurrenceReport;
import cz.cvut.kbss.reporting.model.Person;
import cz.cvut.kbss.reporting.model.Vocabulary;
import cz.cvut.kbss.reporting.persistence.BaseDaoTestRunner;
import org.junit.Before;
import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.*;

import static org.junit.Assert.*;

public class ReportDaoTest extends BaseDaoTestRunner {

    @Autowired
    private ReportDao reportDao;

    @Autowired
    private OccurrenceReportDao occurrenceReportDao;

    private Person author;

    @Before
    public void setUp() {
        this.author = Generator.getPerson();
    }

    @Test
    public void getReportTypesReturnsClassesOfOccurrenceReport() {
        final OccurrenceReport report = persistReport();
        // At least these
        final Set<String> minExpected = new HashSet<>(Arrays.asList(Vocabulary.s_c_report, Vocabulary.s_c_occurrence_report));
        final Set<String> types = reportDao.getReportTypes(report.getKey());
        assertTrue(types.containsAll(minExpected));
    }

    private OccurrenceReport persistReport() {
        final OccurrenceReport report = OccurrenceReportGenerator.generateOccurrenceReport(true);
        persistPerson(author);
        report.setAuthor(author);
        occurrenceReportDao.persist(report);
        return report;
    }

    @Test
    public void getReportTypesGetsTypesForReportIdentifiedByUri() {
        final OccurrenceReport report = persistReport();
        // At least these
        final Set<String> minExpected = new HashSet<>(Arrays.asList(Vocabulary.s_c_report, Vocabulary.s_c_occurrence_report));
        final Set<String> types = reportDao.getReportTypes(report.getUri());
        assertTrue(types.containsAll(minExpected));
    }

    @Test
    public void getReportTypesReturnsEmptySetForUnknownReport() {
        final Set<String> types = reportDao.getReportTypes("unknownReport");
        assertNotNull(types);
        assertTrue(types.isEmpty());
    }

    @Test
    public void getChainTypesReturnsTypesOfAllReportsInChain() {
        final List<OccurrenceReport> chain = persistReportChain();
        // At least these
        final Set<String> minExpected = new HashSet<>();
        minExpected.add(Vocabulary.s_c_occurrence_report);
        chain.forEach(r -> minExpected.addAll(r.getTypes()));

        final Set<String> types = reportDao.getChainTypes(chain.get(0).getFileNumber());
        assertTrue(types.containsAll(minExpected));
    }

    private List<OccurrenceReport> persistReportChain() {
        persistPerson(author);
        final List<OccurrenceReport> chain = OccurrenceReportGenerator.generateOccurrenceReportChain(author);
        chain.get(0).getTypes().add(Vocabulary.s_c_logical_document);
        chain.get(chain.size() - 1).getTypes().add(Vocabulary.s_c_logical_record);
        occurrenceReportDao.persist(chain);
        return chain;
    }

    @Test
    public void getChainTypesReturnsEmptySetForUnknownChain() {
        final Set<String> types = reportDao.getChainTypes(Long.MAX_VALUE);
        assertNotNull(types);
        assertTrue(types.isEmpty());
    }

    @Test
    public void getReportChainRevisionsReturnsAllRevisions() {
        final List<OccurrenceReport> chain = persistReportChain();
        Collections.reverse(chain); // Make it descending by revision number

        final List<ReportRevisionInfo> revisions = reportDao.getReportChainRevisions(chain.get(0).getFileNumber());
        assertEquals(chain.size(), revisions.size());
        for (int i = 0; i < chain.size(); i++) {
            assertEquals(chain.get(i).getUri(), revisions.get(i).getUri());
            assertEquals(chain.get(i).getRevision(), revisions.get(i).getRevision());
        }
    }
}