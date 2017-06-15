package cz.cvut.kbss.reporting.persistence.dao;

import cz.cvut.kbss.jopa.model.EntityManager;
import cz.cvut.kbss.jopa.model.EntityManagerFactory;
import cz.cvut.kbss.reporting.environment.generator.Generator;
import cz.cvut.kbss.reporting.environment.generator.OccurrenceReportGenerator;
import cz.cvut.kbss.reporting.model.*;
import cz.cvut.kbss.reporting.persistence.BaseDaoTestRunner;
import org.junit.Before;
import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;

import java.net.URI;
import java.util.*;

import static cz.cvut.kbss.reporting.environment.util.TestUtils.verifyAllInstancesRemoved;
import static org.junit.Assert.*;

public class OccurrenceReportDaoTest extends BaseDaoTestRunner {

    private static final String ORGANIZATION_NAME = "Czech Technical University in Prague";

    @Autowired
    private OccurrenceReportDao occurrenceReportDao;

    @Autowired
    private OccurrenceDao occurrenceDao;

    @Autowired
    private OrganizationDao organizationDao;

    @Autowired
    private EntityManagerFactory emf;

    private Person author;

    @Before
    public void setUp() throws Exception {
        this.author = Generator.getPerson();
        persistPerson(author);
    }

    @Test
    public void persistNewReportPersistsOccurrenceAsWell() {
        final OccurrenceReport report = persistReport();

        final Occurrence occurrence = occurrenceDao.find(report.getOccurrence().getUri());
        assertNotNull(occurrence);
    }

    private OccurrenceReport persistReport() {
        final OccurrenceReport report = report(false);
        occurrenceReportDao.persist(report);
        return report;
    }

    private OccurrenceReport report(boolean withFactorGraph) {
        final OccurrenceReport report =
                withFactorGraph ? OccurrenceReportGenerator.generateOccurrenceReportWithFactorGraph() :
                OccurrenceReportGenerator.generateOccurrenceReport(true);
        report.setAuthor(author);
        return report;
    }

    @Test
    public void persistReportWithFactorGraphCascadesPersistToAppropriateEventInstances() {
        final OccurrenceReport report = report(true);
        occurrenceReportDao.persist(report);

        final OccurrenceReport res = occurrenceReportDao.find(report.getUri());
        verifyFactorGraph(report.getOccurrence(), res.getOccurrence());
    }

    private void verifyFactorGraph(Occurrence expected, Occurrence actual) {
        assertEquals(expected.getUri(), actual.getUri());
        if (expected.getChildren() != null) {
            assertEquals(expected.getChildren().size(), actual.getChildren().size());
        }
        if (expected.getFactors() != null) {
            assertEquals(expected.getFactors().size(), actual.getFactors().size());
        }
        final Set<URI> visited = new HashSet<>();
        visited.add(actual.getUri());
        verifyChildren(expected.getChildren(), actual.getChildren(), visited);
        verifyFactors(expected.getFactors(), actual.getFactors(), visited);
    }

    private void verifyChildren(Set<Event> expected, Set<Event> actual, Set<URI> visited) {
        final List<Event> lExpected = new ArrayList<>(expected);
        lExpected.sort(Comparator.comparing(AbstractEntity::getUri));
        final List<Event> lActual = new ArrayList<>(actual);
        lActual.sort(Comparator.comparing(AbstractEntity::getUri));
        final Iterator<Event> itExp = lExpected.iterator();
        final Iterator<Event> itAct = lActual.iterator();
        while (itExp.hasNext() && itAct.hasNext()) {
            verifyFactorGraph(itExp.next(), itAct.next(), visited);
        }
    }

    private void verifyFactors(Set<Factor> expected, Set<Factor> actual, Set<URI> visited) {
        final List<Factor> lExpected = new ArrayList<>(expected);
        lExpected.sort(Comparator.comparing(AbstractEntity::getUri));
        final List<Factor> lActual = new ArrayList<>(actual);
        lActual.sort(Comparator.comparing(AbstractEntity::getUri));
        final Iterator<Factor> itExp = lExpected.iterator();
        final Iterator<Factor> itAct = lActual.iterator();
        while (itExp.hasNext() && itAct.hasNext()) {
            verifyFactorGraph(itExp.next().getEvent(), itAct.next().getEvent(), visited);
        }
    }

    private void verifyFactorGraph(Event expected, Event actual, Set<URI> visited) {
        if (visited.contains(actual.getUri())) {
            return;
        }
        visited.add(actual.getUri());
        assertEquals(expected.getUri(), actual.getUri());
        if (expected.getChildren() != null) {
            if (expected.getChildren().isEmpty()) {
                assertTrue(actual.getChildren() == null || actual.getChildren().isEmpty());
            } else {
                assertEquals(expected.getChildren().size(), actual.getChildren().size());
                verifyChildren(expected.getChildren(), actual.getChildren(), visited);
            }
        }
        if (expected.getFactors() != null) {
            if (expected.getFactors().isEmpty()) {
                assertTrue(actual.getFactors() == null || actual.getFactors().isEmpty());
            } else {
                assertEquals(expected.getFactors().size(), actual.getFactors().size());
                verifyFactors(expected.getFactors(), actual.getFactors(), visited);
            }
        }
    }

    @Test
    public void findByOccurrenceGetsReportsWithMatchingOccurrence() {
        final OccurrenceReport report = report(false);
        occurrenceReportDao.persist(report);
        final Occurrence occurrence = report.getOccurrence();

        final OccurrenceReport result = occurrenceReportDao.findByOccurrence(occurrence);
        assertNotNull(result);
        assertEquals(report.getUri(), result.getUri());
    }

    @Test
    public void findByOccurrenceReturnsNullWhenNoMatchingReportIsFound() {
        final Occurrence occurrence = OccurrenceReportGenerator.generateOccurrence();
        occurrenceDao.persist(occurrence);

        assertNull(occurrenceReportDao.findByOccurrence(occurrence));
    }

    @Test
    public void persistPersistsReportWithCorrectiveMeasureRequestsWithResponsibleAgentsAndRelatedOccurrence() {
        final OccurrenceReport report = prepareReportWithMeasureRequests();
        occurrenceReportDao.persist(report);

        final OccurrenceReport result = occurrenceReportDao.findByKey(report.getKey());
        assertNotNull(result);
        verifyCorrectiveMeasureRequests(report.getCorrectiveMeasures(), result.getCorrectiveMeasures());
    }

    private void verifyCorrectiveMeasureRequests(Set<CorrectiveMeasureRequest> expected,
                                                 Set<CorrectiveMeasureRequest> actual) {
        assertEquals(expected.size(), actual.size());
        boolean found;
        for (CorrectiveMeasureRequest r : expected) {
            found = false;
            for (CorrectiveMeasureRequest rr : actual) {
                if (r.getUri().equals(rr.getUri())) {
                    assertEquals(r.getDescription(), rr.getDescription());
                    found = true;
                }
            }
            assertTrue(found);
        }
    }

    private OccurrenceReport prepareReportWithMeasureRequests() {
        final OccurrenceReport report = report(false);
        final Organization org = new Organization(ORGANIZATION_NAME);
        report.setCorrectiveMeasures(new HashSet<>());
        organizationDao.persist(org);   // The organization must exist
        for (int i = 0; i < Generator.randomInt(10); i++) {
            final CorrectiveMeasureRequest req = new CorrectiveMeasureRequest();
            req.setDescription("Corrective measure request " + i);
            if (i % 2 == 0) {
                req.setResponsiblePersons(Collections.singleton(author));
            } else {
                req.setResponsibleOrganizations(Collections.singleton(org));
            }
            req.setBasedOnOccurrence(report.getOccurrence());
            report.getCorrectiveMeasures().add(req);
        }
        return report;
    }

    @Test
    public void updateUpdatesCorrectiveMeasureRequestsInReport() {
        final OccurrenceReport report = prepareReportWithMeasureRequests();
        occurrenceReportDao.persist(report);

        final CorrectiveMeasureRequest newRequest = new CorrectiveMeasureRequest();
        newRequest.setDescription("Added corrective measure request");
        newRequest.setResponsiblePersons(Collections.singleton(author));
        newRequest.setResponsibleOrganizations(Collections.singleton(organizationDao.findByName(ORGANIZATION_NAME)));
        final Iterator<CorrectiveMeasureRequest> it = report.getCorrectiveMeasures().iterator();
        it.next();
        it.remove();
        report.getCorrectiveMeasures().add(newRequest);
        occurrenceReportDao.update(report);

        final OccurrenceReport result = occurrenceReportDao.find(report.getUri());
        verifyCorrectiveMeasureRequests(report.getCorrectiveMeasures(), result.getCorrectiveMeasures());
        verifyOrphanRemoval(report);
    }

    private void verifyOrphanRemoval(OccurrenceReport report) {
        final EntityManager em = emf.createEntityManager();
        try {
            final Integer cnt = em
                    .createNativeQuery("SELECT (count(?x) as ?count) WHERE {?x a ?measureType . }", Integer.class)
                    .setParameter("measureType", URI.create(Vocabulary.s_c_corrective_measure_request))
                    .getSingleResult();
            assertEquals(report.getCorrectiveMeasures().size(), cnt.intValue());
        } finally {
            em.close();
        }
    }

    @Test
    public void updateWorksForReportsWithoutCorrectiveMeasures() {
        final OccurrenceReport report = persistReport();

        report.setSummary("New updated summary.");
        occurrenceReportDao.update(report);

        final OccurrenceReport result = occurrenceReportDao.find(report.getUri());
        assertEquals(report.getSummary(), result.getSummary());
    }

    @Test
    public void reportUpdateCascadesChangeToOccurrence() {
        final OccurrenceReport report = persistReport();

        final String newName = "UpdatedOccurrenceName";
        report.getOccurrence().setName(newName);
        occurrenceReportDao.update(report);

        final OccurrenceReport result = occurrenceReportDao.find(report.getUri());
        assertEquals(newName, result.getOccurrence().getName());
    }

    @Test
    public void updateReportByAddingItemsIntoFactorGraph() {
        final OccurrenceReport report = report(true);
        occurrenceReportDao.persist(report);

        final Event addedOne = new Event();
        addedOne.setStartTime(report.getOccurrence().getStartTime());
        addedOne.setEndTime(report.getOccurrence().getEndTime());
        addedOne.setEventType(Generator.generateEventType());
        final Factor newF = new Factor();
        newF.setEvent(addedOne);
        newF.addType(Generator.randomFactorType());
        report.getOccurrence().addFactor(newF);
        final Event addedChild = new Event();
        addedChild.setStartTime(report.getOccurrence().getStartTime());
        addedChild.setEndTime(report.getOccurrence().getEndTime());
        addedChild.setEventType(Generator.generateEventType());
        report.getOccurrence().getChildren().iterator().next().addChild(addedChild);

        occurrenceReportDao.update(report);

        final OccurrenceReport result = occurrenceReportDao.find(report.getUri());
        verifyFactorGraph(report.getOccurrence(), result.getOccurrence());
    }

    @Test
    public void updateReportByRemovingItemsFromFactorGraph() {
        final OccurrenceReport report = report(true);
        occurrenceReportDao.persist(report);

        final Iterator<Event> evtRemove = report.getOccurrence().getChildren().iterator().next().getChildren()
                                                .iterator();
        evtRemove.next();
        evtRemove.remove();

        final Iterator<Event> factRemove = report.getOccurrence().getFactors().iterator().next().getEvent()
                                                 .getChildren().iterator();
        factRemove.next();
        factRemove.remove();

        occurrenceReportDao.update(report);

        final OccurrenceReport result = occurrenceReportDao.find(report.getUri());
        verifyFactorGraph(report.getOccurrence(), result.getOccurrence());
    }

    @Test
    public void removeDeletesCorrectiveMeasuresAsWell() {
        final OccurrenceReport report = prepareReportWithMeasureRequests();
        occurrenceReportDao.persist(report);

        occurrenceReportDao.remove(report);
        assertFalse(occurrenceReportDao.exists(report.getUri()));
        verifyAllInstancesRemoved(emf, Vocabulary.s_c_corrective_measure_request);
    }

    @Test
    public void removeDeletesCompleteFactorGraph() {
        final OccurrenceReport report = OccurrenceReportGenerator.generateOccurrenceReportWithFactorGraph();
        report.setAuthor(author);
        occurrenceReportDao.persist(report);

        occurrenceReportDao.remove(report);
        verifyAllInstancesRemoved(emf, Vocabulary.s_c_Occurrence);
        verifyAllInstancesRemoved(emf, Vocabulary.s_c_Event);
    }

    @Test
    public void removeDeletesCompleteQuestionAnswerTree() {
        final OccurrenceReport report = OccurrenceReportGenerator.generateOccurrenceReportWithFactorGraph();
        report.setAuthor(author);
        report.getOccurrence().setQuestion(Generator.generateQuestions(2));
        report.getOccurrence().getChildren().iterator().next().setQuestion(Generator.generateQuestions(3));
        occurrenceReportDao.persist(report);

        occurrenceReportDao.remove(report);
        verifyAllInstancesRemoved(emf, Vocabulary.s_c_question);
        verifyAllInstancesRemoved(emf, Vocabulary.s_c_answer);
    }
}
