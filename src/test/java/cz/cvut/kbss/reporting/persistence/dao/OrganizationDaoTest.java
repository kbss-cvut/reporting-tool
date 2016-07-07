package cz.cvut.kbss.reporting.persistence.dao;

import cz.cvut.kbss.reporting.model.Organization;
import cz.cvut.kbss.reporting.persistence.BaseDaoTestRunner;
import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;

import static org.junit.Assert.*;

public class OrganizationDaoTest extends BaseDaoTestRunner {

    @Autowired
    private OrganizationDao organizationDao;

    @Test
    public void persistGeneratesOrganizationUri() {
        final Organization organization = new Organization("Czech Technical University in Prague");
        assertNull(organization.getUri());
        organizationDao.persist(organization);
        assertNotNull(organization.getUri());
    }

    @Test
    public void testFindOrganizationByName() {
        final Organization organization = new Organization("Czech Technical University in Prague");
        organizationDao.persist(organization);

        final Organization res = organizationDao.findByName(organization.getName());
        assertNotNull(res);
        assertEquals(organization.getUri(), res.getUri());
    }
}