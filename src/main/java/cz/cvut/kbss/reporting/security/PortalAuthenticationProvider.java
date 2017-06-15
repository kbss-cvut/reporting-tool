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
import cz.cvut.kbss.reporting.util.ConfigParam;
import cz.cvut.kbss.reporting.util.Constants;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.env.Environment;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.AuthenticationServiceException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.context.SecurityContextImpl;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import javax.servlet.http.HttpServletRequest;
import java.util.Base64;

@Service("portalAuthenticationProvider")
public class PortalAuthenticationProvider implements AuthenticationProvider {

    private static final String PORTAL_TYPE_CONFIG = "portalEndpointType";

    private static final Logger LOG = LoggerFactory.getLogger(PortalAuthenticationProvider.class);

    @Autowired
    private Environment environment;

    @Autowired
    private PersonService personService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private RestTemplate restTemplate;

    @Override
    public Authentication authenticate(Authentication authentication) throws AuthenticationException {
        final String username = authentication.getPrincipal().toString();
        if (LOG.isDebugEnabled()) {
            LOG.debug("Authenticating user {} against the portal.", username);
        }
        final String password = authentication.getCredentials().toString();
        final Person authenticatedUser = authenticateAgainstPortal(username, password);
        saveUser(authenticatedUser);
        final UserDetails userDetails = new PortalUserDetails(authenticatedUser);
        userDetails.eraseCredentials();
        final AuthenticationToken token = new AuthenticationToken(userDetails.getAuthorities(), userDetails);
        token.setAuthenticated(true);
        token.setDetails(userDetails);

        final SecurityContext context = new SecurityContextImpl();
        context.setAuthentication(token);
        SecurityContextHolder.setContext(context);
        return token;
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
    private void saveUser(Person user) {
        final Person existing = personService.findByUsername(user.getUsername());
        if (existing == null) {
            personService.persist(user);
            return;
        }
        if (!existing.nameEquals(user) || !passwordEncoder.matches(user.getPassword(), existing.getPassword())) {
            personService.update(user);
        }
    }

    @Override
    public boolean supports(Class<?> authentication) {
        return UsernamePasswordAuthenticationToken.class.isAssignableFrom(authentication);
    }
}
