/**
 * Copyright (C) 2016 Czech Technical University in Prague
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

import cz.cvut.kbss.reporting.model.Organization;
import cz.cvut.kbss.reporting.persistence.BaseDaoTestRunner;
import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;

import static org.junit.Assert.*;

public class OrganizationDaoTest extends BaseDaoTestRunner {

    private static final String ORGANIZATION_NAME = "Czech Technical University in Prague";

    @Autowired
    private OrganizationDao organizationDao;

    @Test
    public void persistGeneratesOrganizationUri() {
        final Organization organization = new Organization(ORGANIZATION_NAME);
        assertNull(organization.getUri());
        organizationDao.persist(organization);
        assertNotNull(organization.getUri());
    }

    @Test
    public void testFindOrganizationByName() {
        final Organization organization = new Organization(ORGANIZATION_NAME);
        organizationDao.persist(organization);

        final Organization res = organizationDao.findByName(organization.getName());
        assertNotNull(res);
        assertEquals(organization.getUri(), res.getUri());
    }

    @Test
    public void findByNameReturnsNullForUnknownName() {
        final Organization organization = new Organization(ORGANIZATION_NAME);
        organizationDao.persist(organization);

        assertNull(organizationDao.findByName("unknownOrganization"));
    }

    @Test
    public void findByNameReturnsNullForNullArgument() {
        assertNull(organizationDao.findByName(null));
    }
}