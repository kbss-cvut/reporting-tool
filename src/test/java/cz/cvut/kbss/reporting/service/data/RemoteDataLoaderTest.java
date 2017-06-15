package cz.cvut.kbss.reporting.service.data;

import cz.cvut.kbss.reporting.exception.WebServiceIntegrationException;
import cz.cvut.kbss.reporting.service.BaseServiceTestRunner;
import org.junit.Before;
import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.test.web.client.MockRestServiceServer;
import org.springframework.test.web.client.match.MockRestRequestMatchers;
import org.springframework.web.client.RestTemplate;

import java.util.Collections;
import java.util.HashMap;
import java.util.Map;

import static org.junit.Assert.assertEquals;
import static org.springframework.test.web.client.match.MockRestRequestMatchers.method;
import static org.springframework.test.web.client.match.MockRestRequestMatchers.requestTo;
import static org.springframework.test.web.client.response.MockRestResponseCreators.*;

public class RemoteDataLoaderTest extends BaseServiceTestRunner {

    private final String URL = "http://localhost/openrdf-sesame";

    private static final String DATA = "[{\"a\": 1}, {\"a\": 2}]";

    @Autowired
    @Qualifier("remoteDataLoader")
    private DataLoader dataLoader;

    @Autowired
    private RestTemplate restTemplate;

    private MockRestServiceServer mockServer;

    @Before
    public void setUp() {
        this.mockServer = MockRestServiceServer.createServer(restTemplate);
    }

    @Test
    public void loadDataReturnsTheLoadedData() {
        mockServer.expect(requestTo(URL)).andExpect(method(HttpMethod.GET))
                  .andRespond(withSuccess(DATA, MediaType.APPLICATION_JSON));
        final String result = dataLoader.loadData(URL, Collections.emptyMap());
        assertEquals(DATA, result);
    }

    @Test(expected = WebServiceIntegrationException.class)
    public void loadDataThrowsWebServiceIntegrationExceptionWhenErrorResponseIsReturned() {
        mockServer.expect(requestTo(URL)).andExpect(method(HttpMethod.GET))
                  .andRespond(withBadRequest());
        dataLoader.loadData(URL, Collections.emptyMap());
    }

    @Test
    public void loadDataRequestsDataInFormatSpecifiedInParameters() {
        mockServer.expect(requestTo(URL)).andExpect(method(HttpMethod.GET)).andExpect(MockRestRequestMatchers.header(
                HttpHeaders.ACCEPT, MediaType.APPLICATION_XML_VALUE))
                  .andRespond(withSuccess(DATA, MediaType.APPLICATION_JSON));
        final Map<String, String> params = new HashMap<>();
        params.put(HttpHeaders.ACCEPT, MediaType.APPLICATION_XML_VALUE);
        final String result = dataLoader.loadData(URL, params);
        assertEquals(DATA, result);
    }

    @Test
    public void loadDataPassesQueryParamsToTheService() {
        final String url = URL + "?a=1&b=2";
        mockServer.expect(requestTo(url)).andExpect(method(HttpMethod.GET)).andExpect(MockRestRequestMatchers.header(
                HttpHeaders.ACCEPT, MediaType.APPLICATION_XML_VALUE))
                  .andRespond(withSuccess(DATA, MediaType.APPLICATION_JSON));
        final Map<String, String> params = new HashMap<>();
        params.put(HttpHeaders.ACCEPT, MediaType.APPLICATION_XML_VALUE);
        params.put("a", "1");
        params.put("b", "2");
        final String result = dataLoader.loadData(URL, params);
        assertEquals(DATA, result);
    }

    @Test
    public void loadDataPassesQueryParamsCorrectlyIfTheUrlAlreadyContainsQueryParam() {
        final String url = "http://localhost/formGen?id=generate376Forms-0.2";
        final String expectedUrl = url + "&a=1&b=2";
        mockServer.expect(requestTo(expectedUrl)).andExpect(method(HttpMethod.GET)).andExpect(MockRestRequestMatchers.header(
                HttpHeaders.ACCEPT, MediaType.APPLICATION_XML_VALUE))
                  .andRespond(withSuccess(DATA, MediaType.APPLICATION_JSON));
        final Map<String, String> params = new HashMap<>();
        params.put(HttpHeaders.ACCEPT, MediaType.APPLICATION_XML_VALUE);
        params.put("a", "1");
        params.put("b", "2");
        final String result = dataLoader.loadData(url, params);
        assertEquals(DATA, result);
    }

    @Test(expected = WebServiceIntegrationException.class)
    public void loadDataThrowsWebServiceIntegrationExceptionWhenNonSuccessResponseIsReceived() {
        mockServer.expect(requestTo(URL)).andExpect(method(HttpMethod.GET)).andRespond(withBadRequest());
        dataLoader.loadData(URL, Collections.emptyMap());
    }

    @Test(expected = WebServiceIntegrationException.class)
    public void loadDataThrowsWebServiceIntegrationExceptionWhenRemoteServerErrorOccurs() {
        mockServer.expect(requestTo(URL)).andExpect(method(HttpMethod.GET)).andRespond(withServerError());
        dataLoader.loadData(URL, Collections.emptyMap());
    }
}