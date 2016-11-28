package cz.cvut.kbss.reporting.persistence.dao;

import java.net.URI;
import java.util.Collection;
import java.util.List;

/**
 * Base interface for data access objects.
 */
public interface GenericDao<T> {

    /**
     * Finds entity instance with the specified identifier.
     *
     * @param uri Identifier
     * @return Entity instance or {@code null} if no such instance exists
     */
    T find(URI uri);

    /**
     * Finds all instances of the specified class.
     *
     * @return List of instances, possibly empty
     */
    List<T> findAll();

    /**
     * Persists the specified entity.
     *
     * @param entity Entity to persist
     */
    void persist(T entity);

    /**
     * Persists the specified instances.
     *
     * @param entities Entities to persist
     */
    void persist(Collection<T> entities);

    /**
     * Updates the specified entity.
     *
     * @param entity Entity to update
     */
    void update(T entity);

    /**
     * Removes the specified entity.
     *
     * @param entity Entity to remove
     */
    void remove(T entity);

    /**
     * Deletes the specified instances.
     * <p>
     * If any of the entities does not exist, it is skipped and the removal continues.
     *
     * @param entities Entities to remove
     */
    void remove(Collection<T> entities);

    /**
     * Checks whether an entity with the specified URI exists (and has the type managed by this DAO).
     *
     * @param uri Entity identifier
     * @return {@literal true} if entity exists, {@literal false} otherwise
     */
    boolean exists(URI uri);
}
