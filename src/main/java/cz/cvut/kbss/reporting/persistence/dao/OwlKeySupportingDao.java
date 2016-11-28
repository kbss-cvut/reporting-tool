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

import cz.cvut.kbss.reporting.model.Vocabulary;
import cz.cvut.kbss.reporting.model.util.HasOwlKey;
import cz.cvut.kbss.reporting.util.Constants;
import cz.cvut.kbss.reporting.util.IdentificationUtils;
import cz.cvut.kbss.jopa.exceptions.NoResultException;
import cz.cvut.kbss.jopa.model.EntityManager;

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
