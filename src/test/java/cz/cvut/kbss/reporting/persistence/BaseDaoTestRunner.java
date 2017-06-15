package cz.cvut.kbss.reporting.persistence;

import cz.cvut.kbss.reporting.environment.config.TestPersistenceConfig;
import cz.cvut.kbss.reporting.model.Person;
import cz.cvut.kbss.reporting.persistence.dao.PersonDao;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration(classes = {TestPersistenceConfig.class})
@DirtiesContext(classMode = DirtiesContext.ClassMode.AFTER_EACH_TEST_METHOD)
public abstract class BaseDaoTestRunner {

    @Autowired
    private PersonDao personDao;

    protected void persistPerson(Person person) {
        assert person.getUsername() != null;
        if (personDao.findByUsername(person.getUsername()) == null) {
            personDao.persist(person);
        }
    }
}
