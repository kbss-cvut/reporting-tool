package cz.cvut.kbss.reporting.service.factory;

import com.fasterxml.jackson.databind.ObjectMapper;
import cz.cvut.kbss.reporting.environment.config.PropertyMockingApplicationContextInitializer;
import cz.cvut.kbss.reporting.environment.generator.Generator;
import cz.cvut.kbss.reporting.exception.WebServiceIntegrationException;
import cz.cvut.kbss.reporting.model.Event;
import cz.cvut.kbss.reporting.model.InitialReport;
import cz.cvut.kbss.reporting.model.OccurrenceReport;
import cz.cvut.kbss.reporting.model.Vocabulary;
import cz.cvut.kbss.reporting.model.textanalysis.ExtractedItem;
import cz.cvut.kbss.reporting.service.BaseServiceTestRunner;
import cz.cvut.kbss.reporting.util.ConfigParam;
import org.hamcrest.BaseMatcher;
import org.hamcrest.Description;
import org.junit.Before;
import org.junit.Rule;
import org.junit.Test;
import org.junit.rules.ExpectedException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.env.Environment;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.mock.env.MockEnvironment;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.web.client.ExpectedCount;
import org.springframework.test.web.client.MockRestServiceServer;
import org.springframework.web.client.RestTemplate;

import java.net.URI;
import java.util.*;
import java.util.stream.Collectors;
import java.util.stream.IntStream;

import static org.hamcrest.CoreMatchers.containsString;
import static org.junit.Assert.*;
import static org.springframework.test.web.client.match.MockRestRequestMatchers.*;
import static org.springframework.test.web.client.response.MockRestResponseCreators.withServerError;
import static org.springframework.test.web.client.response.MockRestResponseCreators.withSuccess;

@ContextConfiguration(initializers = PropertyMockingApplicationContextInitializer.class)
public class TextAnalyzingOccurrenceReportFactoryTest extends BaseServiceTestRunner {

    private static final String SERVICE_URL = "http://localhost/analyze";
    private static final String EVENT_TYPE_REPO_URL = "http://localhost/model";
    private static final String TEXT = "Initial report text content.";
    private static final double DEFAULT_CONFIDENCE = 0.5;

    @Rule
    public ExpectedException thrown = ExpectedException.none();

    @Autowired
    private TextAnalyzingOccurrenceReportFactory reportFactory;

    @Autowired
    private RestTemplate restTemplate;

    @Autowired
    private Environment environment;

    private ObjectMapper objectMapper = new ObjectMapper();

    private MockRestServiceServer mockServer;

    @Before
    public void setUp() {
        this.mockServer = MockRestServiceServer.createServer(restTemplate);
        final MockEnvironment mockEnvironment = (MockEnvironment) environment;
        mockEnvironment.setProperty(ConfigParam.TEXT_ANALYSIS_SERVICE_URL.toString(), SERVICE_URL);
        mockEnvironment.setProperty(ConfigParam.EVENT_TYPE_REPOSITORY_URL.toString(), EVENT_TYPE_REPO_URL);
    }

    @Test
    public void createFromInitialReportPassesInitialReportContentToTextAnalyzingService() throws Exception {
        final InitialReport initialReport = initialReport();
        mockServer.expect(requestTo(SERVICE_URL)).andExpect(method(HttpMethod.POST)).andExpect(content().string(
                containsString(TEXT))).andRespond(
                withSuccess(objectMapper.writeValueAsString(textAnalysisResult()), MediaType.APPLICATION_JSON));
        final OccurrenceReport result = reportFactory.createFromInitialReport(initialReport);
        assertNotNull(result);
        assertNotNull(result.getInitialReport());
        assertEquals(TEXT, result.getInitialReport().getDescription());
        mockServer.verify();
    }

    private TextAnalyzingOccurrenceReportFactory.TextAnalysisResultWrapper textAnalysisResult() {
        final TextAnalyzingOccurrenceReportFactory.TextAnalysisResultWrapper analysisResult = new TextAnalyzingOccurrenceReportFactory.TextAnalysisResultWrapper();
        final double confidence = 0.5;
        analysisResult.setConfidence(Double.toString(confidence));
        analysisResult.setResults(Collections.emptyList());
        return analysisResult;
    }

    private InitialReport initialReport() {
        final InitialReport initialReport = new InitialReport();
        initialReport.setDescription(TEXT);
        return initialReport;
    }

    @Test
    public void createFromInitialReportThrowsWebServiceIntegrationExceptionWhenErrorOccurs() {
        final InitialReport initialReport = initialReport();
        mockServer.expect(requestTo(SERVICE_URL)).andExpect(method(HttpMethod.POST)).andExpect(content().string(
                containsString(TEXT))).andRespond(withServerError());
        thrown.expect(WebServiceIntegrationException.class);
        reportFactory.createFromInitialReport(initialReport);
    }

    @Test
    public void createFromInitialReportSkipsTextAnalysisWhenServiceUrlIsMissing() {
        final MockEnvironment mockEnvironment = (MockEnvironment) environment;
        mockEnvironment.setProperty(ConfigParam.TEXT_ANALYSIS_SERVICE_URL.toString(), "");
        final OccurrenceReport result = reportFactory.createFromInitialReport(initialReport());
        assertNotNull(result);
        assertNotNull(result.getInitialReport());
        assertEquals(TEXT, result.getInitialReport().getDescription());
    }

    @Test
    public void createFromInitialAttachesTextAnalysisResultsToInitialReport() throws Exception {
        final TextAnalyzingOccurrenceReportFactory.TextAnalysisResultWrapper analysisResult = textAnalysisResult();
        final List<TextAnalyzingOccurrenceReportFactory.TextAnalysisResult> items = IntStream.range(5, 10)
                                                                                             .mapToObj(
                                                                                                     i -> new TextAnalyzingOccurrenceReportFactory.TextAnalysisResult(
                                                                                                             "EventType" +
                                                                                                                     i,
                                                                                                             Generator
                                                                                                                     .generateEventType()))
                                                                                             .collect(
                                                                                                     Collectors
                                                                                                             .toList());
        analysisResult.setResults(items);
        mockServer.expect(requestTo(SERVICE_URL)).andExpect(method(HttpMethod.POST)).andExpect(content().string(
                containsString(TEXT)))
                  .andRespond(withSuccess(objectMapper.writeValueAsString(analysisResult), MediaType.APPLICATION_JSON));
        mockServer.expect(ExpectedCount.manyTimes(), requestTo(containsString(EVENT_TYPE_REPO_URL)))
                  .andRespond(withSuccess("false", MediaType.APPLICATION_JSON));

        final OccurrenceReport result = reportFactory.createFromInitialReport(initialReport());
        final InitialReport initialReport = result.getInitialReport();
        assertEquals(items.size(), initialReport.getExtractedItems().size());
        for (TextAnalyzingOccurrenceReportFactory.TextAnalysisResult r : items) {
            final Optional<ExtractedItem> matching = initialReport.getExtractedItems().stream().filter(item ->
                    item.getLabel().equals(r.getEntityLabel()) &&
                            item.getResource().equals(r.getEntityResource())).findAny();
            assertTrue(matching.isPresent());
            assertEquals(DEFAULT_CONFIDENCE, matching.get().getConfidence(), 0.001);
        }
        mockServer.verify();
    }

    @Test
    public void createFromInitialLooksForExtractedEventTypes() throws Exception {
        final TextAnalyzingOccurrenceReportFactory.TextAnalysisResultWrapper analysisResult = textAnalysisResult();
        final List<TextAnalyzingOccurrenceReportFactory.TextAnalysisResult> items = new ArrayList<>();
        items.add(new TextAnalyzingOccurrenceReportFactory.TextAnalysisResult("someEntity", Generator.generateUri()));
        analysisResult.setResults(items);
        mockServer.expect(requestTo(SERVICE_URL)).andExpect(method(HttpMethod.POST)).andExpect(content().string(
                containsString(TEXT)))
                  .andRespond(withSuccess(objectMapper.writeValueAsString(analysisResult), MediaType.APPLICATION_JSON));
        mockServer.expect(requestTo(containsString(EVENT_TYPE_REPO_URL)))
                  .andRespond(withSuccess("false", MediaType.APPLICATION_JSON));
        final OccurrenceReport result = reportFactory.createFromInitialReport(initialReport());
        assertTrue(result.getOccurrence().getChildren() == null || result.getOccurrence().getChildren().isEmpty());
        mockServer.verify();
    }

    @Test
    public void createFromInitialReportAddsEventsForExtractedEventTypesToOccurrence() throws Exception {
        final TextAnalyzingOccurrenceReportFactory.TextAnalysisResultWrapper analysisResult = textAnalysisResult();
        final List<TextAnalyzingOccurrenceReportFactory.TextAnalysisResult> items = new ArrayList<>();
        final URI eventType = Generator.generateEventType();
        items.add(new TextAnalyzingOccurrenceReportFactory.TextAnalysisResult("event", eventType));
        analysisResult.setResults(items);
        mockServer.expect(requestTo(SERVICE_URL)).andExpect(method(HttpMethod.POST)).andExpect(content().string(
                containsString(TEXT)))
                  .andRespond(withSuccess(objectMapper.writeValueAsString(analysisResult), MediaType.APPLICATION_JSON));
        mockServer.expect(requestTo(containsString(EVENT_TYPE_REPO_URL)))
                  .andRespond(withSuccess("true", MediaType.APPLICATION_JSON));
        final OccurrenceReport result = reportFactory.createFromInitialReport(initialReport());
        assertEquals(1, result.getOccurrence().getChildren().size());
        final Event event = result.getOccurrence().getChildren().iterator().next();
        assertEquals(eventType, event.getEventType());
        mockServer.verify();
    }

    @Test
    public void createFromInitialReportThrowsWebServiceIntegrationWhenUnableToResolveEventTypes() throws Exception {
        final TextAnalyzingOccurrenceReportFactory.TextAnalysisResultWrapper analysisResult = textAnalysisResult();
        final List<TextAnalyzingOccurrenceReportFactory.TextAnalysisResult> items = new ArrayList<>();
        final URI eventType = Generator.generateEventType();
        items.add(new TextAnalyzingOccurrenceReportFactory.TextAnalysisResult("event", eventType));
        analysisResult.setResults(items);
        mockServer.expect(requestTo(SERVICE_URL)).andExpect(method(HttpMethod.POST)).andExpect(content().string(
                containsString(TEXT)))
                  .andRespond(withSuccess(objectMapper.writeValueAsString(analysisResult), MediaType.APPLICATION_JSON));
        mockServer.expect(requestTo(containsString(EVENT_TYPE_REPO_URL)))
                  .andRespond(withServerError());
        thrown.expect(WebServiceIntegrationException.class);
        thrown.expectMessage(containsString("event type."));

        reportFactory.createFromInitialReport(initialReport());
    }

    @Test
    public void addsSuggestedTypeToEventsExtractedByTextAnalysis() throws Exception {
        final TextAnalyzingOccurrenceReportFactory.TextAnalysisResultWrapper analysisResult = textAnalysisResult();
        final List<TextAnalyzingOccurrenceReportFactory.TextAnalysisResult> items = new ArrayList<>();
        final URI eventType = Generator.generateEventType();
        items.add(new TextAnalyzingOccurrenceReportFactory.TextAnalysisResult("event", eventType));
        analysisResult.setResults(items);
        mockServer.expect(requestTo(SERVICE_URL)).andExpect(method(HttpMethod.POST)).andExpect(content().string(
                containsString(TEXT)))
                  .andRespond(withSuccess(objectMapper.writeValueAsString(analysisResult), MediaType.APPLICATION_JSON));
        mockServer.expect(requestTo(containsString(EVENT_TYPE_REPO_URL)))
                  .andRespond(withSuccess("true", MediaType.APPLICATION_JSON));
        final OccurrenceReport result = reportFactory.createFromInitialReport(initialReport());
        result.getOccurrence().getChildren()
              .forEach(e -> assertTrue(e.getTypes().contains(Vocabulary.s_c_suggested_by_text_analysis)));
    }

    @Test
    public void passesVocabulariesToTextAnalysisService() throws Exception {
        final InitialReport initialReport = initialReport();
        final String vocabs = environment.getProperty("text-analysis.vocabularies");
        final VocabularyMatcher matcher = new VocabularyMatcher(Arrays.asList(vocabs.split(",")));
        mockServer.expect(requestTo(SERVICE_URL)).andExpect(method(HttpMethod.POST))
                  .andExpect(content().string(matcher)).andRespond(
                withSuccess(objectMapper.writeValueAsString(textAnalysisResult()), MediaType.APPLICATION_JSON));
        final OccurrenceReport result = reportFactory.createFromInitialReport(initialReport);
        assertNotNull(result);
        mockServer.verify();
    }

    private static final class VocabularyMatcher extends BaseMatcher<String> {

        private final List<String> vocabularies;

        private VocabularyMatcher(List<String> vocabularies) {
            this.vocabularies = vocabularies;
        }

        @Override
        public boolean matches(Object item) {
            if (!(item instanceof String)) {
                return false;
            }
            final String strItem = (String) item;
            final Optional<String> notFound = vocabularies.stream().filter(v -> !strItem.contains(v)).findAny();
            return !notFound.isPresent();
        }

        @Override
        public void describeTo(Description description) {
            description.appendText("should contain all vocabularies ").appendValue(vocabularies);
        }
    }
}
