package cz.cvut.kbss.reporting.persistence.dao;

import cz.cvut.kbss.jopa.exceptions.NoResultException;
import cz.cvut.kbss.jopa.model.EntityManager;
import cz.cvut.kbss.reporting.model.Vocabulary;
import cz.cvut.kbss.reporting.model.util.HasOwlKey;
import cz.cvut.kbss.reporting.util.Constants;
import cz.cvut.kbss.reporting.util.IdentificationUtils;

import java.net.URI;
import java.util.Objects;

/**
 * DAO for entity classes which have an OWL key.
 *
 * @param <T> Entity type
 */
public abstract class OwlKeySupportingDao<T extends HasOwlKey> extends BaseDao<T> {

    protected OwlKeySupportingDao(Class<T> type) {
        super(type);
    }

    /**
     * Generates key and then calls persist.
     *
     * @param entity The instance to persist
     * @param em     Current EntityManager
     */
    @Override
    protected void persist(T entity, EntityManager em) {
        assert entity != null;
        entity.setKey(IdentificationUtils.generateKey());
        super.persist(entity, em);
    }

    /**
     * Finds entity instance by its unique key.
     *
     * @param key Instance key
     * @return Entity instance or {@code null} if no such matching exists
     */
    public T findByKey(String key) {
        Objects.requireNonNull(key);
        final EntityManager em = entityManager();
        try {
            return findByKey(key, em);
        } finally {
            em.close();
        }
    }

    protected T findByKey(String key, EntityManager em) {
        try {
            return em.createNativeQuery("SELECT ?x WHERE { ?x ?hasKey ?key ;" +
                    "a ?type }", type)
                     .setParameter("hasKey", URI.create(Vocabulary.s_p_has_key))
                     .setParameter("key", key, Constants.PU_LANGUAGE).setParameter("type", typeUri).getSingleResult();
        } catch (NoResultException e) {
            return null;
        }
    }
}
