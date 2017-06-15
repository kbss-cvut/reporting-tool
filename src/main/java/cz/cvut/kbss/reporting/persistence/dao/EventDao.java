package cz.cvut.kbss.reporting.persistence.dao;

import cz.cvut.kbss.jopa.model.EntityManager;
import cz.cvut.kbss.jopa.model.EntityManagerFactory;
import cz.cvut.kbss.reporting.model.Event;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.net.URI;
import java.util.Objects;

/**
 * Data access object for reading events from the storage.
 * <p>
 * Only find by URI is supported.
 */
@Repository
public class EventDao {

    @Autowired
    private EntityManagerFactory emf;

    public Event find(URI uri) {
        Objects.requireNonNull(uri);
        final EntityManager em = emf.createEntityManager();
        try {
            return em.find(Event.class, uri);
        } finally {
            em.close();
        }
    }
}
