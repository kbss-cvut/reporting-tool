package cz.cvut.kbss.reporting.service.options;

import cz.cvut.kbss.reporting.environment.config.PropertyMockingApplicationContextInitializer;
import cz.cvut.kbss.reporting.rest.dto.model.RawJson;
import cz.cvut.kbss.reporting.service.BaseServiceTestRunner;
import cz.cvut.kbss.reporting.util.ConfigParam;
import cz.cvut.kbss.reporting.util.Constants;
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
import org.springframework.test.web.client.MockRestServiceServer;
import org.springframework.web.client.RestTemplate;

import java.lang.reflect.Field;
import java.net.URLEncoder;
import java.util.HashSet;
import java.util.Map;
import java.util.Set;

import static org.junit.Assert.*;
import static org.springframework.test.web.client.match.MockRestRequestMatchers.method;
import static org.springframework.test.web.client.match.MockRestRequestMatchers.requestTo;
import static org.springframework.test.web.client.response.MockRestResponseCreators.withSuccess;

@ContextConfiguration(initializers = PropertyMockingApplicationContextInitializer.class)
public class OptionsServiceImplTest extends BaseServiceTestRunner {

    private static final String DATA = "[{\"a\": 1}, {\"a\": 2}]";
    private static final String URL = "http://localhost/openrdf-sesame";

    @Autowired
    private OptionsService optionsService;

    @Autowired
    private RestTemplate restTemplate;

    @Autowired
    private Environment environment;

    @Rule
    public ExpectedException thrown = ExpectedException.none();

    private MockRestServiceServer mockServer;

    @Before
    public void setUp() {
        this.mockServer = MockRestServiceServer.createServer(restTemplate);
        final MockEnvironment mockEnv = (MockEnvironment) environment;
        mockEnv.setProperty(ConfigParam.EVENT_TYPE_REPOSITORY_URL.toString(), URL);
    }

    @Test
    public void getEventTypesLoadsEventsTypesFromRemoteLocation() throws Exception {
        testOptionsLoadingFromRemote("eventType");
    }

    private void testOptionsLoadingFromRemote(String category) throws Exception {
        mockServer.expect(requestTo(expectedUrl("query/" + category + ".sparql"))).andExpect(method(HttpMethod.GET))
                  .andRespond(withSuccess(DATA,
                          MediaType.APPLICATION_JSON));
        final Object res = optionsService.getOptions(category);
        assertTrue(res instanceof RawJson);
        assertEquals(new RawJson(DATA), res);
    }

    private String expectedUrl(String fileName) throws Exception {
        final String sparql = cz.cvut.kbss.reporting.environment.util.Environment
                .loadData(fileName, String.class);
        return URL + "?query=" + URLEncoder.encode(sparql, Constants.UTF_8_ENCODING);
    }

    @Test
    public void getOccurrenceClassesLoadsClassesFromRemoteRepository() throws Exception {
        testOptionsLoadingFromRemote("occurrenceClass");
    }

    @Test
    public void unsupportedOptionThrowsIllegalArgument() {
        final String unknownOptionType = "unknownOptionType";
        thrown.expect(IllegalArgumentException.class);
        thrown.expectMessage("Unsupported option type " + unknownOptionType);
        optionsService.getOptions(unknownOptionType);
    }

    @Test
    public void optionsServiceDiscoversQueryFilesOnStartup() throws Exception {
        final Set<String> expected = new HashSet<>();
        expected.add("eventType");
        expected.add("occurrenceClass");
        expected.add("occurrenceCategory");
        final Field optionCategoriesField = OptionsServiceImpl.class.getDeclaredField("remoteOptions");
        optionCategoriesField.setAccessible(true);
        final Map<String, String> optionCategories = (Map<String, String>) optionCategoriesField.get(optionsService);
        expected.forEach(key -> assertTrue(optionCategories.containsKey(key)));
    }

    @Test
    public void optionsServiceDiscoversLocalOptionsFilesOnStartup() throws Exception {
        final Set<String> expected = new HashSet<>();
        expected.add("reportingPhase");
        final Field optionCategoriesField = OptionsServiceImpl.class.getDeclaredField("localOptions");
        optionCategoriesField.setAccessible(true);
        final Map<String, String> optionCategories = (Map<String, String>) optionCategoriesField.get(optionsService);
        expected.forEach(key -> assertTrue(optionCategories.containsKey(key)));
    }

    @Test
    public void getOptionsLoadsLocalOptions() throws Exception {
        final String type = "reportingPhase";
        final String content = cz.cvut.kbss.reporting.environment.util.Environment
                .loadData("option/reportingPhase.json", String.class);
        final RawJson result = (RawJson) optionsService.getOptions(type);
        assertNotNull(result);
        assertEquals(content, result.getValue());
    }

    @Test
    public void getRemoteOptionsThrowsIllegalStateWhenOptionsRepoUrlIsNotSet() {
        thrown.expect(IllegalStateException.class);
        thrown.expectMessage("Missing repository URL configuration.");
        ((MockEnvironment) environment).setProperty(ConfigParam.EVENT_TYPE_REPOSITORY_URL.toString(), "");
        optionsService.getOptions("eventType");
    }
}