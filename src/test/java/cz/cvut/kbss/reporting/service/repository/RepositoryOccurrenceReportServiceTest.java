package cz.cvut.kbss.reporting.service.repository;

import cz.cvut.kbss.jopa.model.EntityManager;
import cz.cvut.kbss.jopa.model.EntityManagerFactory;
import cz.cvut.kbss.reporting.environment.generator.Generator;
import cz.cvut.kbss.reporting.environment.generator.OccurrenceReportGenerator;
import cz.cvut.kbss.reporting.environment.util.Environment;
import cz.cvut.kbss.reporting.exception.NotFoundException;
import cz.cvut.kbss.reporting.factorgraph.FactorGraphNodeVisitor;
import cz.cvut.kbss.reporting.factorgraph.traversal.FactorGraphTraverser;
import cz.cvut.kbss.reporting.factorgraph.traversal.IdentityBasedFactorGraphTraverser;
import cz.cvut.kbss.reporting.model.*;
import cz.cvut.kbss.reporting.model.textanalysis.ExtractedItem;
import cz.cvut.kbss.reporting.service.BaseServiceTestRunner;
import cz.cvut.kbss.reporting.service.options.ReportingPhaseService;
import cz.cvut.kbss.reporting.util.Constants;
import org.junit.Assert;
import org.junit.Before;
import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;

import java.net.URI;
import java.util.*;
import java.util.stream.Collectors;
import java.util.stream.IntStream;

import static org.junit.Assert.*;

public class RepositoryOccurrenceReportServiceTest extends BaseServiceTestRunner {

    @Autowired
    private ReportingPhaseService phaseService;

    @Autowired
    private RepositoryOccurrenceReportService occurrenceReportService;

    @Autowired
    private EntityManagerFactory emf;

    private Person author;

    @Before
    public void setUp() {
        this.author = persistPerson();
        Environment.setCurrentUser(author);
    }

    @Test
    public void persistSetsAuthorDateCreatedFileNumberAndRevision() {
        final OccurrenceReport report = OccurrenceReportGenerator.generateOccurrenceReport(false);
        assertNull(report.getAuthor());
        assertNull(report.getDateCreated());
        assertNull(report.getFileNumber());
        assertNull(report.getRevision());
        occurrenceReportService.persist(report);
        verifyPersistedReport(report);
    }

    private void verifyPersistedReport(OccurrenceReport report) {
        assertNotNull(report.getAuthor());
        assertTrue(author.nameEquals(report.getAuthor()));
        assertNotNull(report.getDateCreated());
        assertNotNull(report.getFileNumber());
        Assert.assertEquals(Constants.INITIAL_REVISION, report.getRevision());
    }

    @Test
    public void persistCollectionSetsAuthorDateCreatedFileNumberAndRevision() {
        // New file number is used for every instance
        final List<OccurrenceReport> reports = new ArrayList<>();
        for (int i = 0; i < Generator.randomInt(10); i++) {
            reports.add(OccurrenceReportGenerator.generateOccurrenceReport(false));
        }
        occurrenceReportService.persist(reports);
        reports.forEach(this::verifyPersistedReport);
    }

    @Test
    public void persistSetsDefaultReportPhase() {
        final OccurrenceReport report = OccurrenceReportGenerator.generateOccurrenceReport(false);
        assertNull(report.getPhase());
        occurrenceReportService.persist(report);
        assertNotNull(report.getPhase());
        assertEquals(phaseService.getDefaultPhase(), report.getPhase());

        final OccurrenceReport result = occurrenceReportService.find(report.getUri());
        assertEquals(phaseService.getDefaultPhase(), result.getPhase());
    }

    @Test
    public void persistDoesNotSetDefaultPhaseIfPhaseIsAlreadySet() {
        final OccurrenceReport report = OccurrenceReportGenerator.generateOccurrenceReport(false);
        assertNotEquals(phaseService.getInitialPhase(), phaseService.getDefaultPhase());
        report.setPhase(phaseService.getInitialPhase());
        occurrenceReportService.persist(report);
        assertEquals(phaseService.getInitialPhase(), report.getPhase());

        final OccurrenceReport result = occurrenceReportService.find(report.getUri());
        assertEquals(phaseService.getInitialPhase(), result.getPhase());
    }

    @Test
    public void createNewRevisionPersistsNewReportWithIncreasedRevisionNumberSameFileNumberCurrentUserAsAuthorCurrentTimeAsCreationDate() throws Exception {
        final OccurrenceReport firstRevision = persistFirstRevision(false);
        Thread.sleep(100);
        final OccurrenceReport newRevision = occurrenceReportService.createNewRevision(firstRevision.getFileNumber());
        assertNotNull(newRevision);
        assertNotNull(newRevision.getUri());
        assertNotNull(newRevision.getKey());
        assertEquals(firstRevision.getRevision() + 1, newRevision.getRevision().intValue());
        assertEquals(firstRevision.getFileNumber(), newRevision.getFileNumber());
        assertEquals(author, newRevision.getAuthor());
        assertNotEquals(firstRevision.getDateCreated(), newRevision.getDateCreated());
        final OccurrenceReport newRevisionPersisted = occurrenceReportService.find(newRevision.getUri());
        assertNotNull(newRevisionPersisted);
    }

    private OccurrenceReport persistFirstRevision(boolean generateMeasures) {
        final OccurrenceReport firstRevision = OccurrenceReportGenerator.generateOccurrenceReport(true);
        firstRevision.setAuthor(author);
        if (generateMeasures) {
            final Set<CorrectiveMeasureRequest> measures = new HashSet<>();
            for (int i = 0; i < Generator.randomInt(10); i++) {
                final CorrectiveMeasureRequest measureRequest = new CorrectiveMeasureRequest();
                measureRequest.setDescription("Blablabla" + i);
                measureRequest.setBasedOnOccurrence(firstRevision.getOccurrence());
                measureRequest.setResponsiblePersons(Collections.singleton(author));
                measures.add(measureRequest);
            }
            firstRevision.setCorrectiveMeasures(measures);
        }
        occurrenceReportService.persist(firstRevision);
        return firstRevision;
    }

    @Test(expected = NotFoundException.class)
    public void createNewRevisionThrowsNotFoundWhenReportChainDoesNotExist() {
        occurrenceReportService.createNewRevision(Long.MAX_VALUE);
    }

    @Test
    public void createNewRevisionCreatesNewInstancesOfCorrectiveMeasureRequestAndReusesOccurrence() {
        final OccurrenceReport firstRevision = persistFirstRevision(true);
        final Set<URI> measureRequestUris = firstRevision.getCorrectiveMeasures().stream().map(
                CorrectiveMeasureRequest::getUri).collect(Collectors.toSet());

        final OccurrenceReport newRevision = occurrenceReportService.createNewRevision(firstRevision.getFileNumber());
        assertNotNull(newRevision.getCorrectiveMeasures());
        assertEquals(measureRequestUris.size(), newRevision.getCorrectiveMeasures().size());
        newRevision.getCorrectiveMeasures().forEach(mr -> assertFalse(measureRequestUris.contains(mr.getUri())));
        boolean found;
        for (CorrectiveMeasureRequest r : firstRevision.getCorrectiveMeasures()) {
            found = false;
            for (CorrectiveMeasureRequest rr : newRevision.getCorrectiveMeasures()) {
                if (r.getDescription().equals(rr.getDescription())) {
                    found = true;
                }
            }
            assertTrue(found);
        }
    }

    @Test
    public void createNewRevisionWorksRepeatedly() {
        final OccurrenceReport firstRevision = persistFirstRevision(true);
        final Long fileNumber = firstRevision.getFileNumber();
        final List<OccurrenceReport> chain = new ArrayList<>();
        chain.add(firstRevision);
        for (int i = 0; i < Generator.randomInt(10); i++) {
            chain.add(occurrenceReportService.createNewRevision(fileNumber));
        }

        Integer expectedRevision = Constants.INITIAL_REVISION;
        for (OccurrenceReport r : chain) {
            assertEquals(expectedRevision, r.getRevision());
            assertEquals(fileNumber, r.getFileNumber());
            expectedRevision++;
        }
    }

    @Test
    public void updateSetsLastModifiedAndLastModifiedBy() {
        final OccurrenceReport report = persistFirstRevision(true);
        assertNull(report.getLastModifiedBy());
        assertNull(report.getLastModifiedBy());
        report.setSummary("Report summary.");
        occurrenceReportService.update(report);

        final OccurrenceReport result = occurrenceReportService.find(report.getUri());
        assertEquals(Environment.getCurrentUser().getUri(), result.getLastModifiedBy().getUri());
        assertNotNull(result.getLastModified());
    }

    @Test
    public void transitionToNextPhaseSetsNewPhaseOnReport() {
        final OccurrenceReport report = OccurrenceReportGenerator.generateOccurrenceReport(true);
        report.setAuthor(author);
        report.setPhase(phaseService.getInitialPhase());
        occurrenceReportService.persist(report);
        occurrenceReportService.transitionToNextPhase(report);

        final URI expected = phaseService.nextPhase(phaseService.getInitialPhase());
        final OccurrenceReport result = occurrenceReportService.find(report.getUri());
        assertEquals(expected, result.getPhase());
    }

    @Test
    public void transitionToNextPhaseDoesNothingWhenReportHasNoPhase() {
        final OccurrenceReport report = OccurrenceReportGenerator.generateOccurrenceReport(false);
        report.setAuthor(author);
        assertNull(report.getPhase());
        occurrenceReportService.persist(report);
        occurrenceReportService.transitionToNextPhase(report);

        final OccurrenceReport result = occurrenceReportService.find(report.getUri());
        assertEquals(report.getPhase(), result.getPhase());
    }

    @Test
    public void transitionToNextPhaseDoesNothingIfAlreadyInLatestPhase() {
        final OccurrenceReport report = OccurrenceReportGenerator.generateOccurrenceReport(true);
        report.setAuthor(author);
        report.setPhase(phaseService.getInitialPhase());
        URI oldPhase;
        do {
            oldPhase = report.getPhase();
            report.setPhase(phaseService.nextPhase(report.getPhase()));
        } while (!oldPhase.equals(report.getPhase()));
        occurrenceReportService.persist(report);
        occurrenceReportService.transitionToNextPhase(report);

        final OccurrenceReport result = occurrenceReportService.find(report.getUri());
        assertEquals(report.getPhase(), result.getPhase());
    }

    @Test
    public void synchronizesEventTypeAndTypesOnUpdate() {
        final OccurrenceReport report = OccurrenceReportGenerator.generateOccurrenceReport(true);
        report.setAuthor(author);
        report.setPhase(phaseService.getInitialPhase());
        occurrenceReportService.persist(report);

        final URI originalType = report.getOccurrence().getEventType();
        final URI newType = Generator.generateEventType();
        report.getOccurrence().setEventType(newType);

        occurrenceReportService.update(report);

        final Occurrence occurrence = occurrenceReportService.find(report.getUri()).getOccurrence();
        assertEquals(newType, occurrence.getEventType());
        assertFalse(occurrence.getTypes().contains(originalType.toString()));
    }

    @Test
    public void findErasesAuthorCredentials() {
        final OccurrenceReport report = OccurrenceReportGenerator.generateOccurrenceReport(true);
        report.setAuthor(author);
        occurrenceReportService.persist(report);

        final OccurrenceReport result = occurrenceReportService.find(report.getUri());
        assertNull(result.getAuthor().getPassword());
    }

    @Test
    public void findErasesCredentialsOfLastModifier() {
        final Person lastModifier = new Person();
        lastModifier.setFirstName("Last");
        lastModifier.setLastName("Modifier");
        lastModifier.setUsername("last.modifier@fel.cvut.cz");
        lastModifier.setPassword("P@ssw0rd01");
        lastModifier.encodePassword(passwordEncoder);
        personDao.persist(lastModifier);
        final OccurrenceReport report = OccurrenceReportGenerator.generateOccurrenceReport(true);
        report.setAuthor(author);
        report.setLastModifiedBy(lastModifier);
        occurrenceReportService.persist(report);

        final OccurrenceReport result = occurrenceReportService.find(report.getUri());
        assertNull(result.getAuthor().getPassword());
        assertNull(result.getLastModifiedBy().getPassword());
    }

    @Test
    public void findSetsNodeIndexesUsingLexicographicOrderingWhenTheyAreMissing() {
        final OccurrenceReport report = OccurrenceReportGenerator.generateOccurrenceReport(true);
        report.setAuthor(author);
        report.setOccurrence(OccurrenceReportGenerator.generateOccurrenceWithDescendantEvents(false));
        report.getOccurrence().setUri(null);
        final FactorGraphTraverser traverser = new IdentityBasedFactorGraphTraverser(null, null);
        traverser.registerNodeVisitor(new FactorGraphNodeVisitor() {
            @Override
            public void visit(Occurrence occurrence) {
            }

            @Override
            public void visit(Event event) {
                if (Generator.randomBoolean()) {
                    event.setIndex(null);
                }
            }
        });
        traverser.traverse(report.getOccurrence());
        occurrenceReportService.persist(report);

        final OccurrenceReport result = occurrenceReportService.find(report.getUri());
        final FactorGraphTraverser resultTraverser = new IdentityBasedFactorGraphTraverser(
                new FactorGraphNodeVisitor() {
                    @Override
                    public void visit(Occurrence occurrence) {
                    }

                    @Override
                    public void visit(Event event) {
                        assertNotNull(event.getIndex());
                    }
                }, null);
        resultTraverser.traverse(result.getOccurrence());
    }

    @Test
    public void persistPersistsAlsoInitialReport() {
        final OccurrenceReport report = OccurrenceReportGenerator.generateOccurrenceReport(false);
        report.setInitialReport(OccurrenceReportGenerator.generateInitialReport());

        occurrenceReportService.persist(report);
        assertNotNull(report.getInitialReport().getUri());
        final EntityManager em = emf.createEntityManager();
        try {
            assertNotNull(em.find(InitialReport.class, report.getInitialReport().getUri()));
        } finally {
            em.close();
        }
        assertNotNull(occurrenceReportService.find(report.getUri()).getInitialReport());
    }

    @Test
    public void createNewRevisionReferencesOriginalInitialReport() {
        final OccurrenceReport firstRevision = OccurrenceReportGenerator.generateOccurrenceReport(false);
        firstRevision.setInitialReport(OccurrenceReportGenerator.generateInitialReport());
        occurrenceReportService.persist(firstRevision);
        for (int i = 0; i < Generator.randomInt(2, 5); i++) {
            final OccurrenceReport revision = occurrenceReportService.createNewRevision(firstRevision.getFileNumber());
            assertNotNull(revision.getInitialReport());
            assertEquals(firstRevision.getInitialReport().getUri(), revision.getInitialReport().getUri());
        }
    }

    @Test
    public void removeReportChainDeletesCorrectlyInitialReport() {
        final OccurrenceReport firstRevision = OccurrenceReportGenerator.generateOccurrenceReport(false);
        firstRevision.setInitialReport(OccurrenceReportGenerator.generateInitialReport());
        occurrenceReportService.persist(firstRevision);
        final URI initialReportUri = firstRevision.getInitialReport().getUri();
        final List<OccurrenceReport> chain = new ArrayList<>();
        chain.add(firstRevision);
        for (int i = 0; i < Generator.randomInt(2, 5); i++) {
            final OccurrenceReport revision = occurrenceReportService.createNewRevision(firstRevision.getFileNumber());
            assertEquals(firstRevision.getInitialReport().getUri(), revision.getInitialReport().getUri());
            chain.add(revision);
        }
        occurrenceReportService.removeReportChain(firstRevision.getFileNumber());
        chain.forEach(r -> assertFalse(occurrenceReportService.exists(r.getUri())));
        final EntityManager em = emf.createEntityManager();
        try {
            assertNull(em.find(InitialReport.class, initialReportUri));
        } finally {
            em.close();
        }
    }

    @Test
    public void updateTraverserCorrectlyToFactors() {
        final OccurrenceReport report = OccurrenceReportGenerator.generateOccurrenceReport(false);
        report.getOccurrence().addChild(OccurrenceReportGenerator.generateEvent());
        final Event eventWithFactor = OccurrenceReportGenerator.generateEvent();
        report.getOccurrence().addChild(eventWithFactor);
        final Event mitigation = OccurrenceReportGenerator.generateEvent();
        report.getOccurrence().addChild(mitigation);
        final Factor f = new Factor();
        f.setEvent(mitigation);
        f.addType(Generator.randomFactorType());
        eventWithFactor.addFactor(f);
        occurrenceReportService.persist(report);

        final URI newEventType = Generator.generateEventType();
        mitigation.setEventType(newEventType);
        occurrenceReportService.update(report);

        final OccurrenceReport result = occurrenceReportService.find(report.getUri());
        assertEquals(3, result.getOccurrence().getChildren().size());
        final Optional<Event> evtWithFactorResult = result.getOccurrence().getChildren().stream()
                                                          .filter(e -> e.getUri().equals(eventWithFactor.getUri()))
                                                          .findFirst();
        assertTrue(evtWithFactorResult.isPresent());
        final Set<Factor> factors = evtWithFactorResult.get().getFactors();
        assertEquals(1, factors.size());
        final Factor rFactor = factors.iterator().next();
        assertNotNull(rFactor.getEvent());
        assertEquals(mitigation.getUri(), rFactor.getEvent().getUri());
        assertEquals(newEventType, rFactor.getEvent().getEventType());
    }

    /**
     * Testing Bug #411.
     */
    @Test
    public void eventTypeSynchronizationOnUpdateDoesNotLooseEvents() {
        final OccurrenceReport report = OccurrenceReportGenerator.generateOccurrenceReport(false);
        final List<Event> children = IntStream.range(0, 3).mapToObj(i -> {
            final Event evt = OccurrenceReportGenerator.generateEvent();
            evt.setReferenceId(Generator.randomInt());
            evt.setIndex(i);
            return evt;
        }).collect(Collectors.toList());
        final Factor f1 = new Factor();
        f1.setEvent(children.get(1));
        f1.addType(Generator.randomFactorType());
        children.get(0).addFactor(f1);
        report.getOccurrence().setChildren(new HashSet<>(children));
        occurrenceReportService.persist(report);

        report.getOccurrence().getChildren().forEach(e -> assertNotNull(e.getUri()));
        final Event newEvent = OccurrenceReportGenerator.generateEvent();
        newEvent.setReferenceId(Generator.randomInt());
        report.getOccurrence().addChild(newEvent);
        newEvent.setIndex(0);
        final int expectedSize = report.getOccurrence().getChildren().size();
        occurrenceReportService.update(report);

        assertNotNull(newEvent.getUri());
        final OccurrenceReport result = occurrenceReportService.find(report.getUri());
        assertEquals(expectedSize, result.getOccurrence().getChildren().size());
        final EntityManager em = emf.createEntityManager();
        try {
            final Event eResult = em.find(Event.class, newEvent.getUri());
            assertNotNull(eResult);
            assertEquals(newEvent.getEventType(), eResult.getEventType());
            assertEquals(newEvent.getTypes(), eResult.getTypes());
            assertEquals(newEvent.getStartTime(), eResult.getStartTime());
            assertEquals(newEvent.getEndTime(), eResult.getEndTime());
        } finally {
            em.close();
        }
    }

    @Test
    public void persistPersistsAlsoInitialReportWithItemsExtractedByTextAnalysis() {
        final OccurrenceReport report = OccurrenceReportGenerator.generateOccurrenceReport(false);
        final InitialReport initialReport = OccurrenceReportGenerator.generateInitialReport();
        report.setInitialReport(initialReport);
        initialReport.setExtractedItems(IntStream.range(5, 10).mapToObj(
                i -> new ExtractedItem(0.5, "EventType" + i, Generator.generateEventType())).collect(
                Collectors.toSet()));
        occurrenceReportService.persist(report);

        final OccurrenceReport result = occurrenceReportService.find(report.getUri());
        assertNotNull(initialReport);
        assertEquals(initialReport.getExtractedItems().size(), result.getInitialReport().getExtractedItems().size());

        final EntityManager em = emf.createEntityManager();
        try {
            initialReport.getExtractedItems().forEach(item -> {
                assertNotNull(item.getUri());
                final ExtractedItem itemResult = em.find(ExtractedItem.class, item.getUri());
                assertNotNull(itemResult);
                assertEquals(item.getConfidence(), itemResult.getConfidence(), 0.001);
                assertEquals(item.getLabel(), itemResult.getLabel());
                assertEquals(item.getResource(), itemResult.getResource());
            });
        } finally {
            em.close();
        }
    }
}
