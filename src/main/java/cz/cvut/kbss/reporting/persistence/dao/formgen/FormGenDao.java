package cz.cvut.kbss.reporting.persistence.dao.formgen;

import cz.cvut.kbss.jopa.model.EntityManager;
import cz.cvut.kbss.jopa.model.EntityManagerFactory;
import cz.cvut.kbss.jopa.model.descriptors.Descriptor;
import cz.cvut.kbss.jopa.model.descriptors.EntityDescriptor;
import cz.cvut.kbss.reporting.persistence.PersistenceException;
import cz.cvut.kbss.reporting.util.Constants;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;

import java.net.URI;
import java.util.HashMap;
import java.util.Map;
import java.util.Objects;

public abstract class FormGenDao<T> {

    static final Logger LOG = LoggerFactory.getLogger(FormGenDao.class);

    static final String MAIN_CONTEXT = "graphId";

    @Autowired
    @Qualifier("formGen")
    private EntityManagerFactory emf;

    public Map<String, URI> persist(T instance) {
        Objects.requireNonNull(instance);
        final Map<String, URI> contexts = new HashMap<>();
        final URI contextUri = generateContextUri();
        contexts.put(MAIN_CONTEXT, contextUri);
        final EntityManager em = emf.createEntityManager();
        try {
            em.getTransaction().begin();
            final Descriptor descriptor = new EntityDescriptor(contextUri);
            prePersist(instance, em, descriptor);
            em.persist(instance, descriptor);
            postPersist(instance, em, contexts);
            em.getTransaction().commit();
        } catch (Exception e) {
            LOG.error("Error when persisting entity for form generation.", e);
            throw new PersistenceException(e);
        } finally {
            em.close();
        }
        return contexts;
    }

    URI generateContextUri() {
        return URI.create(Constants.FORM_GEN_CONTEXT_BASE + System.currentTimeMillis());
    }

    /**
     * Pre-persist hook, called before the instance is passed to entity manager for persisting.
     *
     * @param instance   The instance to persist
     * @param em         EntityManager with a running transaction
     * @param descriptor Persist descriptor specifying context into which the instance will be persisted
     */
    void prePersist(T instance, EntityManager em, Descriptor descriptor) {
        // Do nothing, intended for overriding
    }


    /**
     * Post-persist hook, called after the instance is persisted, but before transaction commit.
     *
     * @param instance The persisted instance
     * @param em       Entity manager used to persist the {@code instance}
     * @param contexts The contexts Editable map of contexts into which data for form generation were and will be
     *                 persisted
     */
    void postPersist(T instance, EntityManager em, Map<String, URI> contexts) {
        // Do nothing, intended for overriding
    }
}
