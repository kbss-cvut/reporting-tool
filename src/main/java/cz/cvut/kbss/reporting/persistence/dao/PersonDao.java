package cz.cvut.kbss.reporting.persistence.dao;

import cz.cvut.kbss.jopa.exceptions.NoResultException;
import cz.cvut.kbss.jopa.model.EntityManager;
import cz.cvut.kbss.reporting.model.Person;
import cz.cvut.kbss.reporting.model.Vocabulary;
import cz.cvut.kbss.reporting.util.Constants;
import org.springframework.stereotype.Repository;

import java.net.URI;

@Repository
public class PersonDao extends DerivableUriDao<Person> {

    public PersonDao() {
        super(Person.class);
    }

    public Person findByUsername(String username) {
        final EntityManager em = entityManager();
        try {
            return em.createNativeQuery(
                    "SELECT ?x WHERE { ?x ?hasUsername ?username . }", Person.class)
                     .setParameter("hasUsername", URI.create(Vocabulary.s_p_accountName))
                     .setParameter("username", username, Constants.PU_LANGUAGE)
                     .getSingleResult();
        } catch (NoResultException e) {
            return null;
        } finally {
            em.close();
        }
    }
}
