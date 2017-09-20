/**
 * Copyright (C) 2017 Czech Technical University in Prague
 *
 * This program is free software: you can redistribute it and/or modify it under
 * the terms of the GNU General Public License as published by the Free Software
 * Foundation, either version 3 of the License, or (at your option) any
 * later version.
 *
 * This program is distributed in the hope that it will be useful, but WITHOUT
 * ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
 * FOR A PARTICULAR PURPOSE.  See the GNU General Public License for more
 * details. You should have received a copy of the GNU General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
 */
package cz.cvut.kbss.reporting.security;

import com.fasterxml.jackson.databind.ObjectMapper;
import cz.cvut.kbss.jopa.model.EntityManager;
import cz.cvut.kbss.jopa.model.EntityManagerFactory;
import cz.cvut.kbss.reporting.config.RestConfig;
import cz.cvut.kbss.reporting.environment.config.MockSesamePersistence;
import cz.cvut.kbss.reporting.environment.config.PropertyMockingApplicationContextInitializer;
import cz.cvut.kbss.reporting.environment.config.TestSecurityConfig;
import cz.cvut.kbss.reporting.model.Person;
import cz.cvut.kbss.reporting.model.Vocabulary;
import cz.cvut.kbss.reporting.rest.dto.model.PortalUser;
import cz.cvut.kbss.reporting.security.portal.PortalEndpoint;
import cz.cvut.kbss.reporting.security.portal.PortalEndpointType;
import cz.cvut.kbss.reporting.security.portal.PortalUserDetails;
import cz.cvut.kbss.reporting.service.BaseServiceTestRunner;
import cz.cvut.kbss.reporting.service.security.LoginTracker;
import cz.cvut.kbss.reporting.util.ConfigParam;
import cz.cvut.kbss.reporting.util.Constants;
import org.junit.Before;
import org.junit.Rule;
import org.junit.Test;
import org.junit.rules.ExpectedException;
import org.mockito.ArgumentCaptor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.core.env.Environment;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.mock.env.MockEnvironment;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.security.authentication.*;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.web.client.MockRestServiceServer;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import javax.servlet.http.Cookie;
import java.net.URI;

import static org.junit.Assert.*;
import static org.mockito.Mockito.verify;
import static org.springframework.test.web.client.match.MockRestRequestMatchers.method;
import static org.springframework.test.web.client.match.MockRestRequestMatchers.requestTo;
import static org.springframework.test.web.client.response.MockRestResponseCreators.withSuccess;
import static org.springframework.test.web.client.response.MockRestResponseCreators.withUnauthorizedRequest;

@ContextConfiguration(classes = {TestSecurityConfig.class,
        RestConfig.class,
        MockSesamePersistence.class}, initializers = PropertyMockingApplicationContextInitializer.class)
public class PortalAuthenticationProviderTest extends BaseServiceTestRunner {

    @Rule
    public ExpectedException thrown = ExpectedException.none();

    private static final String USERNAME = "masterchief";
    private static final String COMPANY_ID = "117";
    private static final String PASSWORD = "cortanaisthebest";

    @Autowired
    private RestTemplate restTemplate;

    @Autowired
    private Environment environment;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private PasswordEncoder encoder;

    @Autowired
    private LoginTracker loginTracker;

    @Autowired
    @Qualifier("portalAuthenticationProvider")
    AuthenticationProvider provider;

    @Autowired
    private EntityManagerFactory emf;

    private MockRestServiceServer mockServer;

    @Before
    public void setUp() throws Exception {
        this.mockServer = MockRestServiceServer.createServer(restTemplate);
    }

    @Test
    public void unsuccessfulLoginThrowsAuthenticationServiceException() {
        thrown.expect(AuthenticationServiceException.class);
        String expectedUrl = getExpectedUrl();
        mockServer.expect(requestTo(expectedUrl)).andExpect(method(HttpMethod.GET))
                  .andRespond(withUnauthorizedRequest());
        setCompanyIdInCurrentRequest(COMPANY_ID);

        try {
            provider.authenticate(createAuthentication(USERNAME));
        } finally {
            mockServer.verify();
        }
    }

    private String getExpectedUrl() {
        String expectedUrl = environment.getProperty(ConfigParam.PORTAL_URL.toString());
        final PortalEndpoint endpoint = PortalEndpoint.createEndpoint(PortalEndpointType.EMAIL_ADDRESS);
        expectedUrl += "/" + endpoint.constructPath(USERNAME, COMPANY_ID);
        return expectedUrl;
    }

    private Authentication createAuthentication(String username) {
        return new UsernamePasswordAuthenticationToken(username, PASSWORD);
    }

    private void setCompanyIdInCurrentRequest(String companyId) {
        final MockHttpServletRequest request = new MockHttpServletRequest();
        // This is just so that the company Id cookie isn't the only one in the request. It is more realistic
        final Cookie anotherCookie = new Cookie("GUEST_LANGUAGE_ID", "en_US");
        final Cookie companyCookie = new Cookie(Constants.COMPANY_ID_COOKIE, companyId);
        request.setCookies(anotherCookie, companyCookie);
        RequestContextHolder.setRequestAttributes(new ServletRequestAttributes(request));
    }

    @Test
    public void successfulLoginCreatesAuthenticationObjectWithUserData() throws Exception {
        final PortalUser userData = getPortalUser();
        mockServer.expect(requestTo(getExpectedUrl())).andExpect(method(HttpMethod.GET))
                  .andRespond(withSuccess(objectMapper.writeValueAsBytes(userData),
                          MediaType.APPLICATION_JSON));
        setCompanyIdInCurrentRequest(COMPANY_ID);

        final Authentication auth = provider.authenticate(createAuthentication(USERNAME));
        assertTrue(auth.isAuthenticated());
        final PortalUserDetails userDetails = (PortalUserDetails) auth.getDetails();
        assertEquals(userData.getEmailAddress(), userDetails.getUsername());
        mockServer.verify();
    }

    private PortalUser getPortalUser() {
        final PortalUser userData = new PortalUser();
        userData.setFirstName("John");
        userData.setLastName("Spartan");
        userData.setEmailAddress("masterchief@unsc.org");
        return userData;
    }

    @Test
    public void successfulLoginPersistsUserWhenHeDoesNotExistYet() throws Exception {
        final PortalUser userData = getPortalUser();
        assertNull(personDao.findByUsername(userData.getEmailAddress()));
        mockServer.expect(requestTo(getExpectedUrl())).andExpect(method(HttpMethod.GET))
                  .andRespond(withSuccess(objectMapper.writeValueAsBytes(userData),
                          MediaType.APPLICATION_JSON));
        setCompanyIdInCurrentRequest(COMPANY_ID);

        final Authentication auth = provider.authenticate(createAuthentication(USERNAME));
        assertTrue(auth.isAuthenticated());
        final Person res = personDao.findByUsername(userData.getEmailAddress());
        assertNotNull(res);
        assertEquals(userData.getFirstName(), res.getFirstName());
        assertEquals(userData.getLastName(), res.getLastName());
        assertEquals(userData.getEmailAddress(), res.getUsername());
        assertTrue(encoder.matches(PASSWORD, res.getPassword()));
        mockServer.verify();
    }

    @Test
    public void successfulLoginReusesExistingUserInstance() throws Exception {
        final PortalUser userData = getPortalUser();
        final Person p = persistUser(userData);
        mockServer.expect(requestTo(getExpectedUrl())).andExpect(method(HttpMethod.GET))
                  .andRespond(withSuccess(objectMapper.writeValueAsBytes(userData),
                          MediaType.APPLICATION_JSON));
        setCompanyIdInCurrentRequest(COMPANY_ID);

        provider.authenticate(createAuthentication(USERNAME));
        final Person res = personDao.findByUsername(userData.getEmailAddress());
        // This means it didn't persist the new person got from portal, because
        // it would have a different, generated, uri
        assertEquals(p.getUri(), res.getUri());
        mockServer.verify();
    }

    private Person persistUser(PortalUser userData) {
        final Person p = new Person();
        p.setFirstName(userData.getFirstName());
        p.setLastName(userData.getLastName());
        p.setUsername(userData.getEmailAddress());
        p.setPassword(PASSWORD);
        p.encodePassword(encoder);
        personDao.persist(p);
        return p;
    }

    @Test
    public void successfulLoginDifferentPasswordUpdatesUser() throws Exception {
        final PortalUser userData = getPortalUser();
        final Person p = persistUser(userData);
        mockServer.expect(requestTo(getExpectedUrl())).andExpect(method(HttpMethod.GET))
                  .andRespond(withSuccess(objectMapper.writeValueAsBytes(userData),
                          MediaType.APPLICATION_JSON));
        setCompanyIdInCurrentRequest(COMPANY_ID);
        final String updatedPassword = "updatedPassword";

        final Authentication auth = new UsernamePasswordAuthenticationToken(USERNAME, updatedPassword);
        provider.authenticate(auth);
        final Person result = personDao.findByUsername(p.getUsername());
        assertTrue(encoder.matches(updatedPassword, result.getPassword()));
        mockServer.verify();
        final EntityManager em = emf.createEntityManager();
        try {
            final Integer res = em
                    .createNativeQuery("SELECT(count(?p) as ?cnt) WHERE { ?x ?password ?p .}", Integer.class)
                    .setParameter("x", p.getUri()).setParameter("password", URI.create(
                            Vocabulary.s_p_password)).getSingleResult();
            assertEquals(1, res.intValue());
        } finally {
            em.close();
        }
    }

    @Test
    public void throwsAuthenticationExceptionWhenPortalUrlIsNotAvailable() {
        thrown.expect(AuthenticationServiceException.class);
        thrown.expectMessage("Portal is not available.");
        final MockEnvironment me = (MockEnvironment) environment;
        me.setProperty(ConfigParam.PORTAL_URL.toString(), "");
        setCompanyIdInCurrentRequest(COMPANY_ID);

        provider.authenticate(createAuthentication(USERNAME));
    }

    @Test
    public void throwsAuthenticationExceptionWhenApplicationIsNotRunningOnPortal() {
        thrown.expect(AuthenticationServiceException.class);
        thrown.expectMessage("Portal is not available.");
        final MockHttpServletRequest request = new MockHttpServletRequest();
        // No company id -> not running on portal
        RequestContextHolder.setRequestAttributes(new ServletRequestAttributes(request));

        provider.authenticate(createAuthentication(USERNAME));
    }

    @Test
    public void supportsUsernameAndPasswordAuthentication() {
        assertTrue(provider.supports(UsernamePasswordAuthenticationToken.class));
    }

    @Test
    public void throwsLockedExceptionWhenAccountIsLocked() throws Exception {
        thrown.expect(LockedException.class);
        thrown.expectMessage("Account is locked.");
        final PortalUser userData = getPortalUser();
        final Person p = persistUser(userData);
        p.lock();
        personDao.update(p);
        mockServer.expect(requestTo(getExpectedUrl())).andExpect(method(HttpMethod.GET))
                  .andRespond(withSuccess(objectMapper.writeValueAsBytes(userData),
                          MediaType.APPLICATION_JSON));
        setCompanyIdInCurrentRequest(COMPANY_ID);

        provider.authenticate(createAuthentication(USERNAME));
    }

    @Test
    public void successfulLoginNotifiesLoginTracker() throws Exception {
        final PortalUser userData = getPortalUser();
        mockServer.expect(requestTo(getExpectedUrl())).andExpect(method(HttpMethod.GET))
                  .andRespond(withSuccess(objectMapper.writeValueAsBytes(userData),
                          MediaType.APPLICATION_JSON));
        setCompanyIdInCurrentRequest(COMPANY_ID);

        final Authentication auth = provider.authenticate(createAuthentication(USERNAME));
        assertTrue(auth.isAuthenticated());
        final ArgumentCaptor<Person> captor = ArgumentCaptor.forClass(Person.class);
        verify(loginTracker).successfulLoginAttempt(captor.capture());
        assertEquals(userData.getEmailAddress(), captor.getValue().getUsername());
    }

    @Test
    public void throwsDisabledExceptionWhenAccountIsDisabled() throws Exception {
        thrown.expect(DisabledException.class);
        thrown.expectMessage("Account is disabled.");
        final PortalUser userData = getPortalUser();
        final Person p = persistUser(userData);
        p.disable();
        personDao.update(p);
        mockServer.expect(requestTo(getExpectedUrl())).andExpect(method(HttpMethod.GET))
                  .andRespond(withSuccess(objectMapper.writeValueAsBytes(userData),
                          MediaType.APPLICATION_JSON));
        setCompanyIdInCurrentRequest(COMPANY_ID);

        provider.authenticate(createAuthentication(USERNAME));
    }
}