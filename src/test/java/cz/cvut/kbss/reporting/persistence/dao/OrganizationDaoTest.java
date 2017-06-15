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