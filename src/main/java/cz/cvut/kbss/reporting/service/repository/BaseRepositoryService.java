package cz.cvut.kbss.reporting.service.repository;

import cz.cvut.kbss.reporting.persistence.dao.GenericDao;
import cz.cvut.kbss.reporting.service.BaseService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.net.URI;
import java.util.Collection;
import java.util.Objects;

public abstract class BaseRepositoryService<T> implements BaseService<T> {

    protected static final Logger LOG = LoggerFactory.getLogger(BaseRepositoryService.class);

    protected abstract GenericDao<T> getPrimaryDao();

    @Override
    public Collection<T> findAll() {
        final Collection<T> result = getPrimaryDao().findAll();
        result.forEach(this::postLoad);
        return result;
    }

    @Override
    public T find(URI uri) {
        final T result = getPrimaryDao().find(uri);
        postLoad(result);
        return result;
    }

    @Override
    public void persist(T instance) {
        Objects.requireNonNull(instance);
        prePersist(instance);
        getPrimaryDao().persist(instance);
    }

    @Override
    public void persist(Collection<T> instances) {
        Objects.requireNonNull(instances);
        if (instances.isEmpty()) {
            return;
        }
        instances.forEach(this::prePersist);
        getPrimaryDao().persist(instances);
    }

    @Override
    public void update(T instance) {
        Objects.requireNonNull(instance);
        preUpdate(instance);
        getPrimaryDao().update(instance);
    }

    @Override
    public void remove(T instance) {
        getPrimaryDao().remove(instance);
    }

    @Override
    public void remove(Collection<T> instances) {
        getPrimaryDao().remove(instances);
    }

    @Override
    public boolean exists(URI uri) {
        return getPrimaryDao().exists(uri);
    }

    /**
     * Hook for additional business logic to be performed before the specified instance is persisted.
     * <p>
     * Does nothing by default and is intended to be overridden.
     *
     * @param instance The instance to persist, never {@code null}
     */
    protected void prePersist(T instance) {
        // Do nothing, intended for overriding
    }

    /**
     * Hook for additional business logic to be performed before the specified instance is merged into the ontology as
     * update of an existing record.
     * <p>
     * Does nothing by default and is intended to be overridden.
     *
     * @param instance The instance with updated data, never {@code null}
     */
    protected void preUpdate(T instance) {
        // Do nothing, intended for overriding
    }

    /**
     * Hook for additional business logic to be performed after an instance is loaded.
     * <p>
     * Does nothing by default and is intended to be overridden.
     *
     * @param instance The loaded instance, possibly {@code null}
     */
    protected void postLoad(T instance) {
        // Do nothing, intended for overriding
    }
}
