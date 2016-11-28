package cz.cvut.kbss.reporting.security;

import com.fasterxml.jackson.databind.ObjectMapper;
import cz.cvut.kbss.reporting.config.RestConfig;
import cz.cvut.kbss.reporting.environment.config.MockSesamePersistence;
import cz.cvut.kbss.reporting.environment.config.PropertyMockingApplicationContextInitializer;
import cz.cvut.kbss.reporting.environment.config.TestSecurityConfig;
import cz.cvut.kbss.reporting.environment.generator.Generator;
import cz.cvut.kbss.reporting.model.Person;
import cz.cvut.kbss.reporting.security.model.AuthenticationToken;
import cz.cvut.kbss.reporting.security.model.LoginStatus;
import cz.cvut.kbss.reporting.security.model.UserDetails;
import cz.cvut.kbss.reporting.security.portal.PortalUserDetails;
import cz.cvut.kbss.reporting.service.BaseServiceTestRunner;
import cz.cvut.kbss.reporting.util.ConfigParam;
import cz.cvut.kbss.reporting.util.Constants;
import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.env.Environment;
import org.springframework.mock.env.MockEnvironment;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.mock.web.MockHttpServletResponse;
import org.springframework.security.core.Authentication;
import org.springframework.test.context.ContextConfiguration;

import javax.servlet.http.Cookie;

import static org.junit.Assert.*;

@ContextConfiguration(classes = {TestSecurityConfig.class,
        RestConfig.class,
        MockSesamePersistence.class}, initializers = PropertyMockingApplicationContextInitializer.class)
public class AuthenticationSuccessTest extends BaseServiceTestRunner {

    private Person person = Generator.getPerson();

    @Autowired
    private AuthenticationSuccess success;

    @Autowired
    private ObjectMapper mapper;

    @Autowired
    private Environment environment;

    @Test
    public void authenticationSuccessReturnsResponseContainingUsername() throws Exception {
        final MockHttpServletResponse response = response();
        success.onAuthenticationSuccess(request(), response, generateAuthenticationToken());
        verifyLoginStatus(response);
    }

    private void verifyLoginStatus(MockHttpServletResponse response) throws java.io.IOException {
        final LoginStatus status = mapper.readValue(response.getContentAsString(), LoginStatus.class);
        assertTrue(status.isSuccess());
        assertTrue(status.isLoggedIn());
        assertEquals(person.getUsername(), status.getUsername());
        assertNull(status.getErrorMessage());
    }

    static MockHttpServletRequest request() {
        return new MockHttpServletRequest();
    }

    static MockHttpServletResponse response() {
        return new MockHttpServletResponse();
    }

    private Authentication generateAuthenticationToken() {
        final UserDetails userDetails = new UserDetails(person);
        return new AuthenticationToken(userDetails.getAuthorities(), userDetails);
    }

    @Test
    public void loginReturnsIndexPageForApplicationRunningOnPortal() throws Exception {
        final MockHttpServletRequest request = simulateRequestOnPortal();
        final MockHttpServletResponse response = response();
        setIndexFileLocation();
        success.onAuthenticationSuccess(request, response, generatePortalAuthenticationToken());
        final String content = response.getContentAsString();
        assertTrue(content.startsWith("<!DOCTYPE html>"));
    }

    private MockHttpServletRequest simulateRequestOnPortal() {
        final MockHttpServletRequest req = request();
        // This is just so that there are multiple cookies in the request (more realistic)
        final Cookie c2 = new Cookie("GUEST_LANGUAGE_ID", "en_US");
        final Cookie c = new Cookie(Constants.COMPANY_ID_COOKIE, "UNSC");
        req.setCookies(c2, c);
        return req;
    }

    private Authentication generatePortalAuthenticationToken() {
        final UserDetails details = new PortalUserDetails(person);
        return new AuthenticationToken(details.getAuthorities(), details);
    }

    private void setIndexFileLocation() {
        final MockEnvironment mockEnv = (MockEnvironment) environment;
        mockEnv.setProperty(ConfigParam.INDEX_FILE.toString(), "data/index.html");
    }

    @Test
    public void authenticationSuccessReturnsLoginStatusWhenLoggedInAgainstPortalButAccessedOutsideOfIt()
            throws Exception {
        final MockHttpServletResponse response = response();
        setIndexFileLocation();
        success.onAuthenticationSuccess(request(), response, generatePortalAuthenticationToken());
        verifyLoginStatus(response);
    }

    @Test
    public void logoutSuccessReturnsResponseContainingLoginStatus() throws Exception {
        final MockHttpServletResponse response = response();
        success.onLogoutSuccess(request(), response, generateAuthenticationToken());
        final LoginStatus status = mapper.readValue(response.getContentAsString(), LoginStatus.class);
        assertTrue(status.isSuccess());
        assertFalse(status.isLoggedIn());
        assertNull(status.getUsername());
        assertNull(status.getErrorMessage());
    }
}