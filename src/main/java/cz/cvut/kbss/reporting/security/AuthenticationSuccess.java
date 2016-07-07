package cz.cvut.kbss.reporting.security;

import com.fasterxml.jackson.databind.ObjectMapper;
import cz.cvut.kbss.reporting.rest.dto.model.PortalUser;
import cz.cvut.kbss.reporting.rest.util.RestUtils;
import cz.cvut.kbss.reporting.security.model.LoginStatus;
import cz.cvut.kbss.reporting.security.model.UserDetails;
import cz.cvut.kbss.reporting.service.ConfigReader;
import cz.cvut.kbss.reporting.util.ConfigParam;
import cz.cvut.kbss.reporting.util.Constants;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ClassPathResource;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.security.web.authentication.logout.LogoutSuccessHandler;
import org.springframework.stereotype.Service;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;

/**
 * Writes basic login/logout information into the response.
 */
@Service
public class AuthenticationSuccess implements AuthenticationSuccessHandler, LogoutSuccessHandler {

    private static final Logger LOG = LoggerFactory.getLogger(AuthenticationSuccess.class);

    @Autowired
    private ObjectMapper mapper;

    @Autowired
    private ConfigReader config;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest httpServletRequest, HttpServletResponse httpServletResponse,
                                        Authentication authentication) throws IOException, ServletException {
        final String username = getUsername(authentication);
        if (LOG.isTraceEnabled()) {
            LOG.trace("Successfully authenticated user {}", username);
        }
        if (runningOnPortal(authentication, httpServletRequest)) {
            returnIndex(httpServletResponse);
        } else {
            final LoginStatus loginStatus = new LoginStatus(true, authentication.isAuthenticated(), username, null);
            mapper.writeValue(httpServletResponse.getOutputStream(), loginStatus);
        }
    }

    /**
     * For the application to be considered running on portal, the user must have authenticated against the portal and
     * the request must contain {@link Constants#COMPANY_ID_COOKIE}, indicating that the application is being accessed
     * through the portal UI.
     */
    private boolean runningOnPortal(Authentication authentication, HttpServletRequest request) {
        if (!authentication.getAuthorities().contains(new SimpleGrantedAuthority(PortalUser.PORTAL_USER_ROLE))) {
            return false;
        }
        return RestUtils.getCookie(request, Constants.COMPANY_ID_COOKIE) != null;
    }

    private String getUsername(Authentication authentication) {
        if (authentication == null) {
            return "";
        }
        return ((UserDetails) authentication.getPrincipal()).getUsername();
    }

    private void returnIndex(HttpServletResponse response) {
        final ClassPathResource indexFile = new ClassPathResource(config.getConfig(ConfigParam.INDEX_FILE));
        try (BufferedReader in = new BufferedReader(new InputStreamReader(indexFile.getInputStream()))) {
            String line;
            while ((line = in.readLine()) != null) {
                response.getOutputStream().write(line.getBytes());
            }
        } catch (IOException e) {
            LOG.error("Unable to write index.html into response stream.", e);
        }
        response.setHeader("Content-Type", "text/html");
    }

    @Override
    public void onLogoutSuccess(HttpServletRequest httpServletRequest, HttpServletResponse httpServletResponse,
                                Authentication authentication) throws IOException, ServletException {
        if (LOG.isTraceEnabled()) {
            LOG.trace("Successfully logged out user {}", getUsername(authentication));
        }
        final LoginStatus loginStatus = new LoginStatus(false, true, null, null);
        mapper.writeValue(httpServletResponse.getOutputStream(), loginStatus);
    }
}
