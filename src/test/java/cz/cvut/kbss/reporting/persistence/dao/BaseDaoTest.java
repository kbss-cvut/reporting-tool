package cz.cvut.kbss.reporting.persistence.dao;

import cz.cvut.kbss.jopa.model.EntityManager;
import cz.cvut.kbss.jopa.model.EntityManagerFactory;
import cz.cvut.kbss.reporting.environment.generator.Generator;
import cz.cvut.kbss.reporting.model.Person;
import cz.cvut.kbss.reporting.model.Vocabulary;
import cz.cvut.kbss.reporting.persistence.BaseDaoTestRunner;
import cz.cvut.kbss.reporting.persistence.PersistenceException;
import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;

import java.net.URI;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

import static org.junit.Assert.*;

public class BaseDaoTest extends BaseDaoTestRunner {

    @Autowired
    private PersonDao personDao;

    @Autowired
    private EntityManagerFactory emf;

    @Test
    public void existsForExistingInstanceReturnsTrue() throws Exception {
        final Person person = Generator.getPerson();
        personDao.persist(person);
        assertTrue(personDao.exists(person.getUri()));
    }

    @Test
    public void findAllReturnsAllExistingInstances() {
        final List<Person> instances = generateInstances();
        personDao.persist(instances);
        final List<Person> result = personDao.findAll();

        assertEquals(instances.size(), result.size());
        boolean found = false;
        for (Person p : instances) {
            for (Person pp : result) {
                if (p.nameEquals(pp)) {
                    found = true;
                    break;
                }
            }
            assertTrue(found);
        }
    }

    private List<Person> generateInstances() {
        final List<Person> instances = new ArrayList<>();
        for (int i = 0; i < Generator.randomInt(10); i++) {
            final Person p = new Person();
            p.setFirstName("user" + i);
            p.setLastName("lastName" + i);
            p.setUsername("user" + i + "@kbss.felk.cvut.cz");
            instances.add(p);
        }
        return instances;
    }

    @Test
    public void existsReturnsFalseForNullUri() {
        assertFalse(personDao.exists(null));
    }

    @Test
    public void existsReturnsFalseForNullUriWithEntityManager() {
        final EntityManager em = emf.createEntityManager();
        try {
            assertFalse(personDao.exists(null, em));
        } finally {
            em.close();
        }
    }

    @Test
    public void removeCollectionRemovesEveryInstanceInIt() {
        final List<Person> persons = generateInstances();
        personDao.persist(persons);

        personDao.remove(persons);
        persons.forEach(p -> assertNull(personDao.find(p.getUri())));
    }

    @Test
    public void removeEmptyCollectionDoesNothing() {
        final List<Person> persons = generateInstances();
        personDao.persist(persons);

        personDao.remove(Collections.emptyList());
        persons.forEach(p -> assertNotNull(personDao.find(p.getUri())));
    }

    @Test(expected = PersistenceException.class)
    public void persistThrowsPersistenceExceptionWhenExceptionIsThrownByPersistenceProvider() {
        final Person p = new Person();
        p.setFirstName("Catherine");
        p.setLastName("Halsey");
        // No username -> IC violation
        personDao.persist(p);
    }

    @Test(expected = PersistenceException.class)
    public void persistCollectionThrowsPersistenceExceptionWhenExceptionIsThrownByPersistenceProvider() {
        final List<Person> persons = new ArrayList<>();
        for (int i = 0; i < Generator.randomInt(5); i++) {
            final Person p = new Person();
            p.setFirstName("Catherine" + i);
            p.setLastName("Halsey" + i);
            // no username
            persons.add(p);
        }
        final EntityManager em = emf.createEntityManager();
        try {
            personDao.persist(persons);
        } finally {
            assertFalse(em.createNativeQuery("ASK { ?x a ?person . }", Boolean.class).setParameter("person",
                    URI.create(Vocabulary.s_c_Person)).getSingleResult());
            em.close();
        }
    }

    @Test
    public void persistCollectionDoesNothingWhenCollectionIsEmpty() {
        final List<Person> persons = new ArrayList<>();
        personDao.persist(persons);
        final EntityManager em = emf.createEntityManager();
        try {
            assertFalse(em.createNativeQuery("ASK { ?x a ?person . }", Boolean.class).setParameter("person",
                    URI.create(Vocabulary.s_c_Person)).getSingleResult());
        } finally {
            em.close();
        }
    }

    @Test(expected = PersistenceException.class)
    public void updateThrowsPersistenceExceptionWhenExceptionIsThrownByPersistenceProvider() {
        final Person person = Generator.getPerson();
        personDao.persist(person);
        person.setUsername(null);
        personDao.update(person);
    }

    @Test(expected = PersistenceException.class)
    public void removeThrowsPersistenceExceptionWhenExceptionIsThrownByPersistenceProvider() {
        final Person person = Generator.getPerson();
        personDao.remove(person);
    }

    @Test(expected = PersistenceException.class)
    public void removeCollectionThrowsPersistenceExceptionWhenExceptionIsThrownByPersistenceProvider() {
        final List<Person> persons = new ArrayList<>();
        for (int i = 0; i < Generator.randomInt(5); i++) {
            final Person p = new Person();
            p.setFirstName("Catherine" + i);
            p.setLastName("Halsey" + i);
            p.setUsername("halsey" + i + "@unsc.org");
            // no username
            persons.add(p);
        }
        personDao.persist(persons);
        persons.forEach(p -> p.setUri(null));
        final EntityManager em = emf.createEntityManager();
        try {
            personDao.remove(persons);
        } finally {
            persons.forEach(p -> {
                p.generateUri();
                assertNotNull(em.find(Person.class, p.getUri()));
            });
            em.close();
        }
    }
}
