package cz.cvut.kbss.reporting.service;

import java.net.URI;
import java.util.Collection;

public interface BaseService<T> {

    Collection<T> findAll();

    T find(URI uri);

    void persist(T instance);

    void persist(Collection<T> instances);

    void update(T instance);

    void remove(T instance);

    void remove(Collection<T> instances);

    /**
     * Checks whether instance with the specified URI exists.
     *
     * @param uri Instance URI
     * @return Whether a matching instance exists
     */
    boolean exists(URI uri);
}
