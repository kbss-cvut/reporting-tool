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
import cz.cvut.kbss.reporting.config.RestConfig;
import cz.cvut.kbss.reporting.environment.config.MockSesamePersistence;
import cz.cvut.kbss.reporting.environment.config.PropertyMockingApplicationContextInitializer;
import cz.cvut.kbss.reporting.environment.config.TestSecurityConfig;
import cz.cvut.kbss.reporting.security.model.LoginStatus;
import cz.cvut.kbss.reporting.service.BaseServiceTestRunner;
import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.mock.web.MockHttpServletResponse;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.test.context.ContextConfiguration;

import static org.junit.Assert.*;

@ContextConfiguration(classes = {TestSecurityConfig.class,
        RestConfig.class,
        MockSesamePersistence.class}, initializers = PropertyMockingApplicationContextInitializer.class)
public class AuthenticationFailureTest extends BaseServiceTestRunner {

    @Autowired
    private AuthenticationFailure failure;

    @Autowired
    private ObjectMapper mapper;

    @Test
    public void authenticationFailureReturnsLoginStatusWithErrorInfo() throws Exception {
        final MockHttpServletRequest request = AuthenticationSuccessTest.request();
        final MockHttpServletResponse response = AuthenticationSuccessTest.response();
        final String msg = "Username not found";
        final AuthenticationException e = new UsernameNotFoundException(msg);
        failure.onAuthenticationFailure(request, response, e);
        final LoginStatus status = mapper.readValue(response.getContentAsString(), LoginStatus.class);
        assertFalse(status.isSuccess());
        assertFalse(status.isLoggedIn());
        assertNull(status.getUsername());
        assertEquals(msg, status.getErrorMessage());
    }
}