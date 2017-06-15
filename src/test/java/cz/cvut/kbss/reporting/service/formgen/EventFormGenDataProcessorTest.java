package cz.cvut.kbss.reporting.service.formgen;

import cz.cvut.kbss.reporting.environment.config.PropertyMockingApplicationContextInitializer;
import cz.cvut.kbss.reporting.environment.config.TestFormGenConfig;
import cz.cvut.kbss.reporting.environment.generator.Generator;
import cz.cvut.kbss.reporting.environment.generator.OccurrenceReportGenerator;
import cz.cvut.kbss.reporting.environment.util.Environment;
import cz.cvut.kbss.reporting.model.Event;
import cz.cvut.kbss.reporting.model.Occurrence;
import cz.cvut.kbss.reporting.model.OccurrenceReport;
import cz.cvut.kbss.reporting.model.Person;
import cz.cvut.kbss.reporting.persistence.dao.formgen.OccurrenceReportFormGenDao;
import cz.cvut.kbss.reporting.rest.util.RestUtils;
import cz.cvut.kbss.reporting.util.Constants;
import org.junit.Rule;
import org.junit.Test;
import org.junit.rules.ExpectedException;
import org.junit.runner.RunWith;
import org.mockito.ArgumentCaptor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.PropertySource;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

import java.net.URI;
import java.util.Collections;
import java.util.Map;

import static org.junit.Assert.*;
import static org.mockito.Mockito.doReturn;
import static org.mockito.Mockito.verify;

@PropertySource("classpath:config.properties")
@ContextConfiguration(initializers = PropertyMockingApplicationContextInitializer.class,
        classes = {TestFormGenConfig.class})
@RunWith(SpringJUnit4ClassRunner.class)
@DirtiesContext(classMode = DirtiesContext.ClassMode.AFTER_EACH_TEST_METHOD)
public class EventFormGenDataProcessorTest {

    @Rule
    public ExpectedException thrown = ExpectedException.none();

    @Autowired
    private EventFormGenDataProcessor processor;

    @Autowired
    private OccurrenceReportFormGenDao dao;

    @Test
    public void addsUriOfEventUsedForFormGenerationToParams() throws Exception {
        final OccurrenceReport report = getOccurrenceReport();
        final Event evt = report.getOccurrence().getChildren().iterator().next();
        final Integer referenceId = Generator.randomInt();
        evt.setReferenceId(referenceId);
        processor.process(report,
                Collections.singletonMap(EventFormGenDataProcessor.EVENT_PARAM, referenceId.toString()));
        checkForUri(evt.getUri());
    }

    private void checkForUri(URI uri) {
        final Map<String, String> params = processor.getParams();
        assertEquals(RestUtils.encodeUrl(uri.toString()), params.get(EventFormGenDataProcessor.EVENT_PARAM));
    }

    private OccurrenceReport getOccurrenceReport() {
        final OccurrenceReport report = OccurrenceReportGenerator.generateOccurrenceReportWithFactorGraph();
        report.getAuthor().generateUri();
        return report;
    }

    @Test
    public void processAddsUriOfOccurrenceUsedForFormGenerationToParams() throws Exception {
        final OccurrenceReport report = getOccurrenceReport();
        final Occurrence occurrence = report.getOccurrence();
        final Integer referenceId = Generator.randomInt();
        occurrence.setReferenceId(referenceId);
        processor.process(report,
                Collections.singletonMap(EventFormGenDataProcessor.EVENT_PARAM, referenceId.toString()));
        checkForUri(occurrence.getUri());
    }

    @Test
    public void processDoesNothingWhenReferenceIdIsMissing() throws Exception {
        final OccurrenceReport report = getOccurrenceReport();
        processor.process(report, Collections.emptyMap());
        assertFalse(processor.getParams().containsKey(EventFormGenDataProcessor.EVENT_PARAM));
    }

    @Test
    public void processThrowsIllegalArgumentWhenReferenceIdIsNotParseable() throws Exception {
        thrown.expect(IllegalArgumentException.class);
        final String invalidReferenceId = "invalidOne";
        thrown.expectMessage("Event reference id " + invalidReferenceId + " is not valid.");
        final OccurrenceReport report = getOccurrenceReport();
        processor.process(report, Collections.singletonMap(EventFormGenDataProcessor.EVENT_PARAM, invalidReferenceId));
    }

    @Test
    public void processThrowsIllegalArgumentWhenReferenceIdIsNotFoundInFactorGraph() throws Exception {
        thrown.expect(IllegalArgumentException.class);
        final Integer referenceId = Generator.randomInt();
        thrown.expectMessage("Event with reference id " + referenceId + " not found in the factor graph.");
        final OccurrenceReport report = getOccurrenceReport();
        processor.process(report,
                Collections.singletonMap(EventFormGenDataProcessor.EVENT_PARAM, referenceId.toString()));
    }

    /**
     * For cases when the report is new and has no author, yet.
     */
    @Test
    public void processSetsReportAuthorIfItHasNone() throws Exception {
        final OccurrenceReport report = getOccurrenceReport();
        report.setAuthor(null);
        final Person author = Generator.getPerson();
        author.generateUri();
        Environment.setCurrentUser(author);
        processor.process(report, Collections.emptyMap());

        final ArgumentCaptor<OccurrenceReport> r = ArgumentCaptor.forClass(OccurrenceReport.class);
        verify(dao).persist(r.capture());
        final OccurrenceReport arg = r.getValue();
        assertEquals(author, arg.getAuthor());
    }

    @Test
    public void processRemovesCorrectiveMeasuresFromReport() {
        final OccurrenceReport report = getOccurrenceReport();
        doReturn(Collections.emptyMap()).when(dao).persist(report);
        report.setCorrectiveMeasures(Generator.generateCorrectiveMeasureRequests());
        assertFalse(report.getCorrectiveMeasures().isEmpty());
        processor.process(report, Collections.emptyMap());

        final ArgumentCaptor<OccurrenceReport> r = ArgumentCaptor.forClass(OccurrenceReport.class);
        verify(dao).persist(r.capture());
        final OccurrenceReport arg = r.getValue();
        assertTrue(arg.getCorrectiveMeasures().isEmpty());
    }

    @Test
    public void processSetsRevisionWhenItIsNotSet() {
        final OccurrenceReport report = getOccurrenceReport();
        doReturn(Collections.emptyMap()).when(dao).persist(report);
        report.setRevision(null);
        processor.process(report, Collections.emptyMap());

        final ArgumentCaptor<OccurrenceReport> r = ArgumentCaptor.forClass(OccurrenceReport.class);
        verify(dao).persist(r.capture());
        final OccurrenceReport arg = r.getValue();
        assertEquals(Constants.INITIAL_REVISION, arg.getRevision());
    }

    @Test
    public void processSetsFileNumberWhenItIsNotPresent() {
        final OccurrenceReport report = getOccurrenceReport();
        doReturn(Collections.emptyMap()).when(dao).persist(report);
        report.setFileNumber(null);
        processor.process(report, Collections.emptyMap());

        final ArgumentCaptor<OccurrenceReport> r = ArgumentCaptor.forClass(OccurrenceReport.class);
        verify(dao).persist(r.capture());
        final OccurrenceReport arg = r.getValue();
        assertNotNull(arg.getFileNumber());
    }
}