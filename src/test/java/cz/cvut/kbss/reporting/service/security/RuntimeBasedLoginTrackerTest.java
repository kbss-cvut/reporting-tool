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
package cz.cvut.kbss.reporting.service.security;

import cz.cvut.kbss.reporting.environment.generator.Generator;
import cz.cvut.kbss.reporting.model.Person;
import cz.cvut.kbss.reporting.security.SecurityConstants;
import cz.cvut.kbss.reporting.service.event.LoginAttemptsThresholdExceeded;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationListener;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

import static org.junit.Assert.*;
import static org.mockito.Matchers.any;
import static org.mockito.Mockito.*;

@Configuration
@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration(classes = {RuntimeBasedLoginTrackerTest.class})
@DirtiesContext(classMode = DirtiesContext.ClassMode.AFTER_EACH_TEST_METHOD)
public class RuntimeBasedLoginTrackerTest {

    @Bean
    public LoginTracker loginTracker() {
        return new RuntimeBasedLoginTracker();
    }

    @Bean
    public LoginListener loginListener() {
        return spy(new LoginListener());
    }

    @Autowired
    private LoginTracker loginTracker;

    @Autowired
    private LoginListener listener;

    private Person person;

    @Before
    public void setUp() {
        this.person = Generator.getPerson();
        person.generateUri();
    }

    @Test
    public void emitsThresholdExceededEventWhenMaximumLoginCountIsExceeded() {
        for (int i = 0; i < SecurityConstants.MAX_LOGIN_ATTEMPTS; i++) {
            assertNull(listener.user);
            loginTracker.unsuccessfulLoginAttempt(person);
        }
        loginTracker.unsuccessfulLoginAttempt(person);
        assertNotNull(listener.user);
        assertEquals(person, listener.user);
    }

    @Test
    public void doesNotReemitThresholdExceededWhenAdditionalLoginAttemptsAreMade() {
        for (int i = 0; i < SecurityConstants.MAX_LOGIN_ATTEMPTS * 2; i++) {
            loginTracker.unsuccessfulLoginAttempt(person);
        }
        verify(listener, times(1)).onApplicationEvent(any());
    }

    @Test
    public void successfulLoginResetsCounter() {
        for (int i = 0; i < SecurityConstants.MAX_LOGIN_ATTEMPTS - 1; i++) {
            loginTracker.unsuccessfulLoginAttempt(person);
        }
        loginTracker.successfulLoginAttempt(person);
        for (int i = 0; i < SecurityConstants.MAX_LOGIN_ATTEMPTS; i++) {
            loginTracker.unsuccessfulLoginAttempt(person);
        }
        verify(listener, never()).onApplicationEvent(any());
    }

    public static class LoginListener implements ApplicationListener<LoginAttemptsThresholdExceeded> {

        private Person user;

        @Override
        public void onApplicationEvent(LoginAttemptsThresholdExceeded event) {
            this.user = event.getUser();
        }
    }
}