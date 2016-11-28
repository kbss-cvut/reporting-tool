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