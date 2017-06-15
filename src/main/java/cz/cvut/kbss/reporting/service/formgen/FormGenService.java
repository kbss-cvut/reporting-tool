package cz.cvut.kbss.reporting.service.formgen;

import cz.cvut.kbss.reporting.rest.dto.model.RawJson;

import java.util.Map;

public interface FormGenService {

    /**
     * Gets a form structure description for the specified data.
     *
     * @param data   Data for the form
     * @param params Additional parameters for the form generator
     * @return Form structure description in JSON(-LD)
     */
    <T> RawJson generateForm(T data, Map<String, String> params);

    /**
     * Loads possible values for a question using the specified query.
     *
     * @param query The query to use
     * @return Possible values in JSON-LD
     */
    RawJson getPossibleValues(String query);
}
