package cz.cvut.kbss.reporting.service.repository;

import cz.cvut.kbss.reporting.persistence.dao.GenericDao;
import cz.cvut.kbss.reporting.service.BaseService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.net.URI;
import java.util.Collection;

public abstract class BaseRepositoryService<T> implements BaseService<T> {

    protected static final Logger LOG = LoggerFactory.getLogger(BaseRepositoryService.class);

    protected abstract GenericDao<T> getPrimaryDao();

    @Override
    public Collection<T> findAll() {
        return getPrimaryDao().findAll();
    }

    @Override
    public T find(URI uri) {
        return getPrimaryDao().find(uri);
    }

    @Override
    public void persist(T instance) {
        getPrimaryDao().persist(instance);
    }

    @Override
    public void persist(Collection<T> instances) {
        getPrimaryDao().persist(instances);
    }

    @Override
    public void update(T instance) {
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
}
