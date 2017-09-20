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
import cz.cvut.kbss.reporting.environment.util.Environment;
import cz.cvut.kbss.reporting.model.Person;
import cz.cvut.kbss.reporting.security.model.UserDetails;
import cz.cvut.kbss.reporting.service.BaseServiceTestRunner;
import org.junit.After;
import org.junit.Before;
import org.junit.Rule;
import org.junit.Test;
import org.junit.rules.ExpectedException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;

import static org.hamcrest.CoreMatchers.containsString;
import static org.junit.Assert.*;

public class SecurityUtilsTest extends BaseServiceTestRunner {

    @Rule
    public ExpectedException thrown = ExpectedException.none();

    @Autowired
    private SecurityUtils securityUtils;

    private Person person;

    @Before
    public void setUp() {
        this.person = Generator.getPerson();
        person.generateUri();
    }

    @After
    public void tearDown() {
        SecurityContextHolder.clearContext();
    }

    @Test
    public void getCurrentUserReturnsCurrentlyLoggedInUser() {
        Environment.setCurrentUser(person);
        final Person result = securityUtils.getCurrentUser();
        assertEquals(person, result);
    }

    @Test
    public void getCurrentUserDetailsReturnsUserDetailsOfCurrentlyLoggedInUser() {
        Environment.setCurrentUser(person);
        final UserDetails result = securityUtils.getCurrentUserDetails();
        assertNotNull(result);
        assertTrue(result.isEnabled());
        assertEquals(person, result.getUser());
    }

    @Test
    public void getCurrentUserDetailsReturnsNullIfNoUserIsLoggedIn() {
        assertNull(securityUtils.getCurrentUserDetails());
    }

    @Test
    public void updateCurrentUserReplacesUserInCurrentSecurityContext() {
        Environment.setCurrentUser(person);
        final Person update = new Person();
        update.setUri(Generator.generateUri());
        update.setFirstName("updatedFirstName");
        update.setLastName("updatedLastName");
        update.setPassword(person.getPassword());
        update.setUsername(person.getUsername());
        personDao.update(update);
        securityUtils.updateCurrentUser();

        final Person currentUser = securityUtils.getCurrentUser();
        assertTrue(update.nameEquals(currentUser));
    }

    @Test
    public void verifyCurrentUserPasswordThrowsIllegalArgumentWhenPasswordDoesNotMatch() {
        Environment.setCurrentUser(person);
        final String password = "differentPassword";
        thrown.expect(IllegalArgumentException.class);
        thrown.expectMessage(containsString("does not match"));
        securityUtils.verifyCurrentUserPassword(password);
    }
}
