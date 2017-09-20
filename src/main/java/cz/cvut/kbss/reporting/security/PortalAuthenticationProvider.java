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

import cz.cvut.kbss.reporting.model.Person;
import cz.cvut.kbss.reporting.rest.dto.model.PortalUser;
import cz.cvut.kbss.reporting.rest.util.RestUtils;
import cz.cvut.kbss.reporting.security.model.AuthenticationToken;
import cz.cvut.kbss.reporting.security.model.UserDetails;
import cz.cvut.kbss.reporting.security.portal.PortalEndpoint;
import cz.cvut.kbss.reporting.security.portal.PortalEndpointType;
import cz.cvut.kbss.reporting.security.portal.PortalUserDetails;
import cz.cvut.kbss.reporting.service.PersonService;
import cz.cvut.kbss.reporting.service.security.LoginTracker;
import cz.cvut.kbss.reporting.service.security.SecurityUtils;
import cz.cvut.kbss.reporting.util.ConfigParam;
import cz.cvut.kbss.reporting.util.Constants;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.env.Environment;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationServiceException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import javax.servlet.http.HttpServletRequest;
import java.util.Base64;

@Service("portalAuthenticationProvider")
public class PortalAuthenticationProvider extends AbstractAuthenticationProvider {

    private static final String PORTAL_TYPE_CONFIG = "portalEndpointType";

    private static final Logger LOG = LoggerFactory.getLogger(PortalAuthenticationProvider.class);

    private final Environment environment;

    private final PersonService personService;

    private final RestTemplate restTemplate;

    @Autowired
    public PortalAuthenticationProvider(Environment environment, PersonService personService,
                                        RestTemplate restTemplate, PasswordEncoder passwordEncoder,
                                        SecurityUtils securityUtils, LoginTracker loginTracker) {
        super(passwordEncoder, securityUtils, loginTracker);
        this.environment = environment;
        this.personService = personService;
        this.restTemplate = restTemplate;
    }


    @Override
    public Authentication authenticate(Authentication authentication) throws AuthenticationException {
        final String username = authentication.getPrincipal().toString();
        if (LOG.isDebugEnabled()) {
            LOG.debug("Authenticating user {} against the portal.", username);
        }
        final String password = authentication.getCredentials().toString();
        final Person authenticatedUser = authenticateAgainstPortal(username, password);
        final UserDetails userDetails = new PortalUserDetails(authenticatedUser);
        final Person original = personService.findByUsername(authenticatedUser.getUsername());
        if (original != null) {
            verifyAccountStatus(original);
        }
        final AuthenticationToken auth = securityUtils.setCurrentUser(userDetails);
        saveUser(authenticatedUser, original);
        loginSuccess(authenticatedUser);
        return auth;
    }

    private Person authenticateAgainstPortal(String username, String password) {
        String url = environment.getProperty(ConfigParam.PORTAL_URL.toString(), "");
        if (url.isEmpty()) {
            throw new AuthenticationServiceException("Portal is not available.");
        }
        if (!url.endsWith("/")) {
            url += "/";
        }
        final PortalEndpoint portalEndpoint = resolvePortalEndpoint();
        try {
            String companyId = getCompanyId();
            url += portalEndpoint.constructPath(username, companyId);
            final HttpHeaders requestHeaders = new HttpHeaders();
            requestHeaders
                    .add("Authorization", Constants.BASIC_AUTHORIZATION_PREFIX + encodeBase64(username, password));
            final HttpEntity<Object> entity = new HttpEntity<>(null, requestHeaders);
            final PortalUser portalUser = restTemplate.exchange(url, HttpMethod.GET, entity, PortalUser.class)
                                                      .getBody();
            if (portalUser == null || portalUser.getEmailAddress() == null) {
                throw new AuthenticationServiceException("Unable to authenticate user on portal.");
            }
            final Person person = portalUser.toPerson();
            person.setPassword(password);
            return person;
        } catch (RestClientException e) {
            LOG.error("Unable to get user info from portal at " + url, e);
            throw new AuthenticationServiceException("Unable to authenticate user on portal.", e);
        }
    }

    private PortalEndpoint resolvePortalEndpoint() {
        final String portalEndpointType = environment
                .getProperty(PORTAL_TYPE_CONFIG, PortalEndpointType.EMAIL_ADDRESS.toString());
        return PortalEndpoint.createEndpoint(PortalEndpointType.fromString(portalEndpointType));
    }

    private String getCompanyId() {
        final String companyId = RestUtils.getCookie(getCurrentRequest(), Constants.COMPANY_ID_COOKIE);
        if (companyId == null) {
            throw new AuthenticationServiceException("Portal is not available.");
        }
        return companyId;
    }

    private HttpServletRequest getCurrentRequest() {
        return ((ServletRequestAttributes) RequestContextHolder.currentRequestAttributes()).getRequest();
    }

    private String encodeBase64(String username, String password) {
        final String value = username + ":" + password;
        return Base64.getEncoder().encodeToString(value.getBytes());
    }

    /**
     * We store the user because it is associated with occurrence reports.
     */
    private void saveUser(Person user, Person existing) {
        if (existing == null) {
            personService.persist(user);
            return;
        }
        if (!existing.nameEquals(user) || !passwordEncoder.matches(user.getPassword(), existing.getPassword())) {
            personService.update(user);
        }
    }
}
