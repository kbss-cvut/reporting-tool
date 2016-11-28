package cz.cvut.kbss.reporting.service.search;

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

import java.net.URLEncoder;

import static org.junit.Assert.assertEquals;
import static org.springframework.test.web.client.match.MockRestRequestMatchers.method;
import static org.springframework.test.web.client.match.MockRestRequestMatchers.requestTo;
import static org.springframework.test.web.client.response.MockRestResponseCreators.withSuccess;

@ContextConfiguration(initializers = PropertyMockingApplicationContextInitializer.class)
public class SearchServiceTest extends BaseServiceTestRunner {

    private static final String DATA = "[{\"a\": 1}, {\"a\": 2}]";
    private static final String URL = "http://localhost/openrdf-sesame";

    @Autowired
    private RestTemplate restTemplate;

    @Autowired
    private Environment environment;

    @Rule
    public ExpectedException thrown = ExpectedException.none();

    private MockRestServiceServer mockServer;

    @Autowired
    private SearchService searchService;

    @Before
    public void setUp() {
        this.mockServer = MockRestServiceServer.createServer(restTemplate);
        final MockEnvironment mockEnv = (MockEnvironment) environment;
        mockEnv.setProperty(ConfigParam.REPOSITORY_URL.toString(), URL);
    }

    @Test
    public void searchReturnsResultsOfRemoteSearch() throws Exception {
        final String expr = "fullTextSearch expression";
        mockServer.expect(requestTo(expectedUrl(expr))).andExpect(method(HttpMethod.GET))
                  .andRespond(withSuccess(DATA, MediaType.APPLICATION_JSON));
        final RawJson result = searchService.fullTextSearch(expr);
        assertEquals(DATA, result.getValue());
    }

    private String expectedUrl(String expression) throws Exception {
        String query = cz.cvut.kbss.reporting.environment.util.Environment
                .loadData(Constants.FULL_TEXT_SEARCH_QUERY_FILE, String.class);
        query = query.replace("?expression", "\"" + expression + "\"");
        return URL + "?" + Constants.QUERY_QUERY_PARAM + "=" + URLEncoder.encode(query, Constants.UTF_8_ENCODING);
    }
}
