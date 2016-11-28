package cz.cvut.kbss.reporting.service.repository;

import cz.cvut.kbss.reporting.model.util.HasOwlKey;
import cz.cvut.kbss.reporting.persistence.dao.OwlKeySupportingDao;

/**
 * Implements the {@link #findByKey(String)} method for all services which support key-based identification.
 *
 * @param <T> Entity type supporting keys
 */
abstract class KeySupportingRepositoryService<T extends HasOwlKey> extends BaseRepositoryService<T> {

    @Override
    protected abstract OwlKeySupportingDao<T> getPrimaryDao();

    /**
     * Finds instance with the specified key.
     *
     * @param key Instance key
     * @return Matching instance or {@code null}, if none exists
     */
    public T findByKey(String key) {
        final T result = getPrimaryDao().findByKey(key);
        postLoad(result);
        return result;
    }
}
