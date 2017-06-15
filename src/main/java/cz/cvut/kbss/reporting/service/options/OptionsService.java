package cz.cvut.kbss.reporting.service.options;

import cz.cvut.kbss.reporting.rest.dto.model.RawJson;

public interface OptionsService {

    /**
     * Gets options of the specified type.
     *
     * @param type Options type
     * @return Object representing the options. This will most often be a {@link RawJson} containing options retrieved
     * from a remote repository. Otherwise, it can be an array/list of options.
     * @throws IllegalArgumentException When the specified option type is not supported
     */
    Object getOptions(String type);
}
