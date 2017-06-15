package cz.cvut.kbss.reporting.service.factory;

import com.fasterxml.jackson.annotation.JsonProperty;
import cz.cvut.kbss.reporting.exception.WebServiceIntegrationException;
import cz.cvut.kbss.reporting.model.Event;
import cz.cvut.kbss.reporting.model.InitialReport;
import cz.cvut.kbss.reporting.model.OccurrenceReport;
import cz.cvut.kbss.reporting.model.Vocabulary;
import cz.cvut.kbss.reporting.model.textanalysis.ExtractedItem;
import cz.cvut.kbss.reporting.service.data.DataLoader;
import cz.cvut.kbss.reporting.util.ConfigParam;
import cz.cvut.kbss.reporting.util.Constants;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.context.annotation.PropertySource;
import org.springframework.core.env.Environment;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;

import javax.annotation.PostConstruct;
import java.net.URI;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;

@PropertySource("classpath:text-analysis.properties")
@Service
public class TextAnalyzingOccurrenceReportFactory extends DefaultOccurrenceReportFactory {

    private static final Logger LOG = LoggerFactory.getLogger(TextAnalyzingOccurrenceReportFactory.class);

    private static final String IS_EVENT_TYPE_QUERY_FILE = "query/isEventType.sparql";

    private final RestTemplate restTemplate;

    private final Environment environment;

    private DataLoader localLoader;

    private String isEventTypeQuery;
    private final List<String> vocabularies;

    @Autowired
    public TextAnalyzingOccurrenceReportFactory(RestTemplate restTemplate, Environment environment,
                                                @Qualifier("localDataLoader") DataLoader localLoader) {
        this.restTemplate = restTemplate;
        this.environment = environment;
        this.localLoader = localLoader;
        final String vocabs = environment.getProperty(ConfigParam.TEXT_ANALYSIS_VOCABULARIES.toString(), "");
        this.vocabularies = Arrays.asList(vocabs.split(","));
    }

    @PostConstruct
    private void loadQueries() {
        this.isEventTypeQuery = localLoader.loadData(IS_EVENT_TYPE_QUERY_FILE, Collections.emptyMap());
        this.localLoader = null;    // Don't need it anymore
    }

    /**
     * Creates an {@link OccurrenceReport} based on analysis of the text of the specified initial report.
     *
     * @param initialReport The initial report to analyze
     * @return New occurrence report
     */
    @Override
    public OccurrenceReport createFromInitialReport(InitialReport initialReport) {
        final OccurrenceReport report = super.createFromInitialReport(initialReport);
        analyze(report);
        return report;
    }

    private void analyze(OccurrenceReport report) {
        final TextAnalysisInput taInput = new TextAnalysisInput(report.getInitialReport().getDescription());
        taInput.setVocabulary(vocabularies);
        final String serviceUrl = environment.getProperty(ConfigParam.TEXT_ANALYSIS_SERVICE_URL.toString(), "");
        if (serviceUrl.isEmpty()) {
            return;
        }
        try {
            final TextAnalysisResultWrapper result = restTemplate
                    .exchange(serviceUrl, HttpMethod.POST, new HttpEntity<>(taInput), TextAnalysisResultWrapper.class)
                    .getBody();
            enhanceReportWithTextAnalysisResults(report, result);
            if (LOG.isTraceEnabled()) {
                LOG.trace("TextAnalysis result: {}.", result);
            }
        } catch (RestClientException e) {
            LOG.error("Error during analysis of the initial report.", e);
            throw new WebServiceIntegrationException("Unable to analyze initial report content.", e);
        }
    }

    private void enhanceReportWithTextAnalysisResults(OccurrenceReport report, TextAnalysisResultWrapper result) {
        final Double confidence = Double.parseDouble(result.confidence);
        result.getResults().forEach(r -> {
            attachTextAnalysisResultsToInitialReport(report.getInitialReport(), r, confidence);
            addEventForExtractedEventType(report, r);
        });
    }

    private void attachTextAnalysisResultsToInitialReport(InitialReport report, TextAnalysisResult result,
                                                          Double confidence) {
        report.addExtractedItem(new ExtractedItem(confidence, result.entityLabel, result.entityResource));
    }

    private void addEventForExtractedEventType(OccurrenceReport report, TextAnalysisResult extractedItem) {
        if (isEventType(extractedItem.entityResource)) {
            final Event event = new Event();
            event.setEventType(extractedItem.entityResource);
            event.getTypes().add(Vocabulary.s_c_suggested_by_text_analysis);
            event.setStartTime(report.getOccurrence().getStartTime());
            event.setEndTime(report.getOccurrence().getEndTime());
            report.getOccurrence().addChild(event);
        }
    }

    private boolean isEventType(URI resource) {
        final String query = isEventTypeQuery.replaceAll("\\?term", "<" + resource.toString() + ">");
        String url = environment.getProperty(ConfigParam.EVENT_TYPE_REPOSITORY_URL.toString());
        final MultiValueMap<String, String> headers = new LinkedMultiValueMap<>(2);
        headers.add(HttpHeaders.ACCEPT, Constants.TEXT_BOOLEAN_TYPE);
        final MultiValueMap<String, String> data = new LinkedMultiValueMap<>(2);
        data.add(Constants.QUERY_QUERY_PARAM, query);
        final HttpEntity<MultiValueMap<String, String>> request = new HttpEntity<>(data, headers);
        try {
            // No Boolean message converter exists and there is no point in creating one for this one use, so we
            // are using string
            final ResponseEntity<String> result = restTemplate.postForEntity(url, request, String.class);
            return result.getBody().equals(Boolean.TRUE.toString());
        } catch (RestClientException e) {
            LOG.error("Unable to resolve whether resource " + resource + " is an event type.", e);
            throw new WebServiceIntegrationException(
                    "Unable to resolve whether resource " + resource + " is an event type.", e);
        }
    }

    static class TextAnalysisInput {
        private final String text;
        private List<String> vocabulary;

        TextAnalysisInput(String text) {
            this.text = text;
        }

        public String getText() {
            return text;
        }

        public List<String> getVocabulary() {
            return vocabulary;
        }

        public void setVocabulary(List<String> vocabulary) {
            this.vocabulary = vocabulary;
        }
    }

    static class TextAnalysisResultWrapper {

        private String confidence;
        @JsonProperty("stanbol")
        private List<TextAnalysisResult> results;

        public String getConfidence() {
            return confidence;
        }

        void setConfidence(String confidence) {
            this.confidence = confidence;
        }

        public List<TextAnalysisResult> getResults() {
            return results;
        }

        void setResults(List<TextAnalysisResult> results) {
            this.results = results;
        }

        @Override
        public String toString() {
            return "TextAnalysisResultWrapper{" +
                    "confidence='" + confidence + '\'' +
                    ", results=" + results +
                    '}';
        }
    }

    static class TextAnalysisResult {
        private String entityLabel;
        private URI entityResource;

        public TextAnalysisResult() {
            // Public constructor for JSON (de)serialization
        }

        TextAnalysisResult(String entityLabel, URI entityResource) {
            this.entityLabel = entityLabel;
            this.entityResource = entityResource;
        }

        public String getEntityLabel() {
            return entityLabel;
        }

        void setEntityLabel(String entityLabel) {
            this.entityLabel = entityLabel;
        }

        public URI getEntityResource() {
            return entityResource;
        }

        void setEntityResource(URI entityResource) {
            this.entityResource = entityResource;
        }

        @Override
        public String toString() {
            return "{" +
                    "entityLabel='" + entityLabel + '\'' +
                    ", entityResource='" + entityResource + '\'' +
                    '}';
        }
    }
}
