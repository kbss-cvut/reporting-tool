package cz.cvut.kbss.reporting.service.formgen;

import cz.cvut.kbss.jopa.model.EntityManager;
import cz.cvut.kbss.jopa.model.EntityManagerFactory;
import cz.cvut.kbss.reporting.environment.config.DataDaoPersistenceConfig;
import cz.cvut.kbss.reporting.environment.config.MockSesamePersistence;
import cz.cvut.kbss.reporting.environment.config.PropertyMockingApplicationContextInitializer;
import cz.cvut.kbss.reporting.environment.config.TestServiceConfig;
import cz.cvut.kbss.reporting.environment.generator.Generator;
import cz.cvut.kbss.reporting.environment.generator.OccurrenceReportGenerator;
import cz.cvut.kbss.reporting.model.OccurrenceReport;
import cz.cvut.kbss.reporting.model.Vocabulary;
import cz.cvut.kbss.reporting.persistence.dao.formgen.OccurrenceReportFormGenDao;
import cz.cvut.kbss.reporting.rest.dto.model.RawJson;
import cz.cvut.kbss.reporting.util.ConfigParam;
import cz.cvut.kbss.reporting.util.Constants;
import org.hamcrest.BaseMatcher;
import org.hamcrest.Description;
import org.junit.Assert;
import org.junit.Before;
import org.junit.Rule;
import org.junit.Test;
import org.junit.rules.ExpectedException;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.context.annotation.PropertySource;
import org.springframework.core.env.Environment;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.mock.env.MockEnvironment;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
import org.springframework.test.web.client.MockRestServiceServer;
import org.springframework.web.client.RestTemplate;

import java.lang.reflect.Field;
import java.net.URI;
import java.net.URLEncoder;
import java.util.Collections;
import java.util.HashMap;
import java.util.Map;

import static org.junit.Assert.*;
import static org.springframework.test.web.client.match.MockRestRequestMatchers.method;
import static org.springframework.test.web.client.match.MockRestRequestMatchers.requestTo;
import static org.springframework.test.web.client.response.MockRestResponseCreators.withSuccess;

@PropertySource("classpath:config.properties")
@ContextConfiguration(initializers = PropertyMockingApplicationContextInitializer.class,
        classes = {TestServiceConfig.class,
                DataDaoPersistenceConfig.class,
                MockSesamePersistence.class})
@RunWith(SpringJUnit4ClassRunner.class)
@DirtiesContext(classMode = DirtiesContext.ClassMode.AFTER_EACH_TEST_METHOD)
public class FormGenServiceImplTest {

    private static final String MOCK_FORM_STRUCTURE = "{\"form\": {\"sections\": [{\"id\": \"sectionOne\"}, {\"id\": \"sectionTwo\"}]}}";

    @Autowired
    private Environment environment;

    @Autowired
    private FormGenService formGenService;

    @Autowired
    @Qualifier("formGen")
    private EntityManagerFactory emf;

    @Autowired
    private RestTemplate restTemplate;

    private MockRestServiceServer mockServer;

    @Rule
    public ExpectedException thrown = ExpectedException.none();

    @Before
    public void setUp() throws Exception {
        this.mockServer = MockRestServiceServer.createServer(restTemplate);
    }

    @Test
    public void formGenServicePersistsSpecifiedOccurrenceReportWhenFormIsRequested() {
        setupRemoteFormGenServiceMock(Collections.emptyMap());
        final OccurrenceReport report = getOccurrenceReport();
        formGenService.generateForm(report, Collections.emptyMap());
        final EntityManager em = emf.createEntityManager();
        try {
            assertTrue(em.createNativeQuery("ASK { ?x a ?report .} ", Boolean.class).setParameter("report", URI.create(
                    Vocabulary.s_c_occurrence_report)).getSingleResult());
        } finally {
            em.close();
        }
    }

    private OccurrenceReport getOccurrenceReport() {
        final OccurrenceReport report = OccurrenceReportGenerator.generateOccurrenceReportWithFactorGraph();
        report.getAuthor().generateUri();   // This won't be necessary in code, the user is already persisted
        return report;
    }

    @Test
    public void formGenServiceThrowsIllegalArgumentForUnsupportedDataType() {
        thrown.expect(IllegalArgumentException.class);
        thrown.expectMessage("Unsupported data type for form generation.");
        formGenService.generateForm(Generator.getPerson(), Collections.emptyMap());
    }

    @Test
    public void formGenPassesRepositoryUrlAndReportContextUrlToRemoteFormGenerator() throws Exception {
        final Field reportContextNameField = OccurrenceReportFormGenDao.class.getDeclaredField("REPORT_CONTEXT_NAME");
        reportContextNameField.setAccessible(true);
        // We're not interested in the param value, because it is random. Just check its presence
        setupRemoteFormGenServiceMock(Collections.singletonMap((String) reportContextNameField.get(null), ""));

        final OccurrenceReport report = getOccurrenceReport();
        final RawJson result = formGenService.generateForm(report, Collections.emptyMap());
        assertNotNull(result);
        assertEquals(MOCK_FORM_STRUCTURE, result.getValue());
        mockServer.verify();
    }

    @Test
    public void formGenPassesE5DataContextUrlToRemoteFormGenerator() throws Exception {
        final Field dataContextNameField = OccurrenceReportFormGenDao.class.getDeclaredField("DATA_CONTEXT_NAME");
        dataContextNameField.setAccessible(true);
        // We're not interested in the param value, because it is random. Just check its presence
        setupRemoteFormGenServiceMock(Collections.singletonMap((String) dataContextNameField.get(null), ""));

        final OccurrenceReport report = getOccurrenceReport();
        final RawJson result = formGenService.generateForm(report, Collections.emptyMap());
        assertNotNull(result);
        assertEquals(MOCK_FORM_STRUCTURE, result.getValue());
        mockServer.verify();
    }

    @Test
    public void formGenPassesParametersToRemoteFormGenerator() throws Exception {
        final OccurrenceReport report = OccurrenceReportGenerator.generateOccurrenceReportWithFactorGraph();
        final Map<String, String> params = Collections
                .singletonMap("eventType", report.getOccurrence().getEventType().toString());
        setupRemoteFormGenServiceMock(params);

        report.getAuthor().generateUri();
        final RawJson result = formGenService.generateForm(report, params);
        assertNotNull(result);
    }

    private void setupRemoteFormGenServiceMock(Map<String, String> params) {
        final String serviceUrl = environment.getProperty(ConfigParam.FORM_GEN_SERVICE_URL.toString());
        final String formGenRepoUrl = environment.getProperty("test." + ConfigParam.FORM_GEN_REPOSITORY_URL.toString());
        final String appRepoUrl = environment.getProperty("test." + ConfigParam.REPOSITORY_URL.toString());
        ((MockEnvironment) environment).setProperty(ConfigParam.FORM_GEN_REPOSITORY_URL.toString(), formGenRepoUrl);
        ((MockEnvironment) environment).setProperty(ConfigParam.REPOSITORY_URL.toString(), appRepoUrl);
        final Map<String, String> expectedParams = new HashMap<>(params);
        expectedParams.put(FormGenServiceImpl.REPOSITORY_URL_PARAM, formGenRepoUrl);

        mockServer.expect(requestTo(new UrlWithParamsMatcher(serviceUrl, expectedParams)))
                  .andExpect(method(HttpMethod.GET))
                  .andRespond(withSuccess(MOCK_FORM_STRUCTURE, MediaType.APPLICATION_JSON));
    }

    @Test
    public void generateFormReturnsEmptyJsonWhenRemoteServiceUrlIsMissing() {
        setupRemoteFormGenServiceMock(Collections.emptyMap());
        ((MockEnvironment) environment).setProperty(ConfigParam.FORM_GEN_SERVICE_URL.toString(), "");
        final OccurrenceReport report = getOccurrenceReport();

        Assert.assertEquals("", formGenService.generateForm(report, Collections.emptyMap()).getValue());
    }

    @Test
    public void getPossibleValuesExecutesExecutesPassedInQuery() throws Exception {
        final String url = environment.getProperty(ConfigParam.FORM_GEN_SERVICE_URL.toString());
        final String query = URLEncoder.encode("SELECT * WHERE {?x ?y ?z .}", Constants.UTF_8_ENCODING);
        final String arg = url + "/query=" + query;
        mockServer.expect(requestTo(new UrlWithParamsMatcher(url, Collections.singletonMap("query", query))))
                  .andExpect(method(HttpMethod.GET))
                  .andRespond(withSuccess(MOCK_FORM_STRUCTURE, MediaType.APPLICATION_JSON));

        final RawJson result = formGenService.getPossibleValues(arg);
        assertEquals(MOCK_FORM_STRUCTURE, result.getValue());
    }

    private static final class UrlWithParamsMatcher extends BaseMatcher<String> {

        private final String url;
        private final Map<String, String> params;

        private UrlWithParamsMatcher(String url, Map<String, String> params) {
            this.url = url;
            this.params = params;
        }

        @Override
        public boolean matches(Object item) {
            final String actual = item.toString();
            if (!actual.startsWith(url)) {
                return false;
            }
            for (Map.Entry<String, String> e : params.entrySet()) {
                if (!actual.contains(e.getKey() + "=" + e.getValue())) {
                    return false;
                }
            }
            return true;
        }

        @Override
        public void describeTo(Description description) {
            description.appendValue(url);
            boolean first = true;
            for (Map.Entry<String, String> e : params.entrySet()) {
                description.appendValue((first ? "?" : "&") + e.getKey() + "=" + e.getValue());
                first = false;
            }
        }
    }
}