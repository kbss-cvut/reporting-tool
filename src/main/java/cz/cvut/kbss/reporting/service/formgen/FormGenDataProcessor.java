package cz.cvut.kbss.reporting.service.formgen;

import cz.cvut.kbss.reporting.persistence.dao.formgen.FormGenDao;

import java.net.URI;
import java.util.Collections;
import java.util.HashMap;
import java.util.Map;
import java.util.Objects;

/**
 * Processor of data used for form generation.
 * <p>
 * In case the data used by form generator need to be processed in any way, instances of this class will take care of
 * the processing.
 * <p>
 * This class is intended to be extended. It only persists the data.
 *
 * @param <T>
 */
abstract class FormGenDataProcessor<T> {

    Map<String, String> params;

    FormGenDataProcessor() {
    }

    /**
     * Processes the data used for form generation.
     *
     * @param data   The data to process
     * @param params Additional parameters to pass to the form generator
     */
    void process(T data, Map<String, String> params) {
        Objects.requireNonNull(data);
        Objects.requireNonNull(params);

        final Map<String, URI> contexts = getPrimaryDao().persist(data);
        this.params = new HashMap<>(params);
        contexts.entrySet().forEach(e -> this.params.put(e.getKey(), e.getValue().toString()));
    }

    /**
     * Gets parameters for the remote form generator.
     *
     * @return Map of parameters
     */
    Map<String, String> getParams() {
        return Collections.unmodifiableMap(params);
    }

    abstract FormGenDao<T> getPrimaryDao();
}
