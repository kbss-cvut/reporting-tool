package cz.cvut.kbss.reporting.service.data;

import java.util.Map;

public interface DataLoader {

    /**
     * Loads data from the specified source.
     *
     * @param source Source of the data
     * @param params Loading parameters. These can be e.g. query parameter for a remote request.
     * @return The loaded data as String
     */
    String loadData(String source, Map<String, String> params);
}
