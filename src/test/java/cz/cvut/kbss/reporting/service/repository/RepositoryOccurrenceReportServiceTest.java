package cz.cvut.kbss.reporting.service.repository;

import cz.cvut.kbss.reporting.environment.generator.Generator;
import cz.cvut.kbss.reporting.environment.generator.OccurrenceReportGenerator;
import cz.cvut.kbss.reporting.environment.util.Environment;
import cz.cvut.kbss.reporting.exception.NotFoundException;
import cz.cvut.kbss.reporting.model.CorrectiveMeasureRequest;
import cz.cvut.kbss.reporting.model.Occurrence;
import cz.cvut.kbss.reporting.model.OccurrenceReport;
import cz.cvut.kbss.reporting.model.Person;
import cz.cvut.kbss.reporting.service.BaseServiceTestRunner;
import cz.cvut.kbss.reporting.service.options.ReportingPhaseService;
import cz.cvut.kbss.reporting.util.Constants;
import org.junit.Before;
import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;

import java.net.URI;
import java.util.*;
import java.util.stream.Collectors;

import static org.junit.Assert.*;

public class RepositoryOccurrenceReportServiceTest extends BaseServiceTestRunner {

    @Autowired
    private ReportingPhaseService phaseService;

    @Autowired
    private RepositoryOccurrenceReportService occurrenceReportService;

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
        assertEquals(Constants.INITIAL_REVISION, report.getRevision());
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
    public void createNewRevisionPersistsNewReportWithIncreasedRevisionNumberSameFileNumberCurrentUserAsAuthorCurrentTimeAsCreationDate() {
        final OccurrenceReport firstRevision = persistFirstRevision(false);

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
}
