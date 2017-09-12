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
package cz.cvut.kbss.reporting.persistence.dao;

import cz.cvut.kbss.reporting.environment.generator.Generator;
import cz.cvut.kbss.reporting.model.Person;
import cz.cvut.kbss.reporting.persistence.BaseDaoTestRunner;
import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;

import static org.junit.Assert.*;

public class PersonDaoTest extends BaseDaoTestRunner {

    @Autowired
    private PersonDao dao;

    @Test
    public void persistGeneratesInstanceUri() {
        final Person p = Generator.getPerson();
        assertNull(p.getUri());
        dao.persist(p);
        assertNotNull(p.getUri());
    }

    @Test
    public void findByUsernameFindsCorrespondingUser() {
        final Person p = Generator.getPerson();
        persistPerson(p);

        final Person res = dao.findByUsername(p.getUsername());
        assertNotNull(res);
        assertEquals(p.getUri(), res.getUri());
        assertTrue(p.nameEquals(res));
    }

    @Test
    public void findByUsernameReturnsNullWhenNoMatchingUserExists() {
        assertNull(dao.findByUsername("unknownUser"));
    }
}