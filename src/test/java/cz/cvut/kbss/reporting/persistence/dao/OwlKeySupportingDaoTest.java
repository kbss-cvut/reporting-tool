package cz.cvut.kbss.reporting.persistence.dao;

import cz.cvut.kbss.reporting.environment.generator.Generator;
import cz.cvut.kbss.reporting.environment.generator.OccurrenceReportGenerator;
import cz.cvut.kbss.reporting.model.OccurrenceReport;
import cz.cvut.kbss.reporting.model.Person;
import cz.cvut.kbss.reporting.persistence.BaseDaoTestRunner;
import org.junit.Before;
import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;

import static org.junit.Assert.*;

public class OwlKeySupportingDaoTest extends BaseDaoTestRunner {

    @Autowired
    private OccurrenceReportDao dao;    // OccurrenceReportDao supports OWL keys

    private Person author;

    @Before
    public void setUp() {
        this.author = Generator.getPerson();
        persistPerson(author);
    }

    @Test
    public void persistGeneratesKeyForEntity() {
        final OccurrenceReport report = OccurrenceReportGenerator.generateOccurrenceReport(true);
        report.setAuthor(author);
        assertNull(report.getKey());
        dao.persist(report);
        assertNotNull(report.getKey());
    }

    @Test
    public void findByKeyReturnsInstanceWithMatchingKey() {
        final OccurrenceReport report = OccurrenceReportGenerator.generateOccurrenceReport(true);
        report.setAuthor(author);
        dao.persist(report);

        final OccurrenceReport res = dao.findByKey(report.getKey());
        assertNotNull(res);
        assertEquals(report.getUri(), res.getUri());
    }

    @Test
    public void findByKeyReturnsNullWhenNoMatchingInstanceExists() {
        assertNull(dao.findByKey("SomeRandomKey"));
    }
}