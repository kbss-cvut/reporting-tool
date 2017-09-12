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
package cz.cvut.kbss.reporting.security.model;

import cz.cvut.kbss.reporting.environment.generator.Generator;
import cz.cvut.kbss.reporting.model.Person;
import cz.cvut.kbss.reporting.model.Vocabulary;
import cz.cvut.kbss.reporting.security.SecurityConstants;
import org.junit.Test;
import org.springframework.security.core.authority.SimpleGrantedAuthority;

import static org.junit.Assert.assertTrue;

public class UserDetailsTest {

    @Test
    public void constructorAddsDefaultRole() {
        final Person p = Generator.getPerson();
        final UserDetails details = new UserDetails(p);
        assertTrue(
                details.getAuthorities().contains(new SimpleGrantedAuthority(SecurityConstants.Role.USER.getName())));
    }

    @Test
    public void constructorAddsRolesMatchingPersonTypes() {
        final Person p = Generator.getPerson();
        p.getTypes().add(Vocabulary.s_c_admin);
        final UserDetails details = new UserDetails(p);
        assertTrue(
                details.getAuthorities().contains(new SimpleGrantedAuthority(SecurityConstants.Role.USER.getName())));
        assertTrue(
                details.getAuthorities().contains(new SimpleGrantedAuthority(SecurityConstants.Role.ADMIN.getName())));
    }
}