package cz.cvut.kbss.reporting.service.search;

import cz.cvut.kbss.reporting.rest.dto.model.RawJson;
import cz.cvut.kbss.reporting.service.ConfigReader;
import cz.cvut.kbss.reporting.service.data.DataLoader;
import cz.cvut.kbss.reporting.util.ConfigParam;
import cz.cvut.kbss.reporting.util.Constants;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;

import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;
import java.util.Collections;
import java.util.HashMap;
import java.util.Map;
import java.util.Objects;

@Service
public class SearchService {

    private static final String EXPRESSION_PLACEHOLDER = "?expression";

    @Autowired
    @Qualifier("remoteDataLoader")
    private DataLoader remoteLoader;

    @Autowired
    @Qualifier("localDataLoader")
    private DataLoader localLoader;

    @Autowired
    private ConfigReader configReader;

    /**
     * Runs a full-text search for the specified expression.
     *
     * @param expression The expression to search for
     * @return Search results in JSON-LD
     */
    public RawJson fullTextSearch(String expression) {
        Objects.requireNonNull(expression);
        String query = getQuery(expression);
        try {
            query = URLEncoder.encode(query, Constants.UTF_8_ENCODING);
            final Map<String, String> params = new HashMap<>(4);
            params.put(Constants.QUERY_QUERY_PARAM, query);
            params.put(HttpHeaders.ACCEPT, MediaType.APPLICATION_JSON_VALUE);
            final String repositoryUrl = configReader.getConfig(ConfigParam.REPOSITORY_URL);
            assert !"".equals(repositoryUrl);
            final String data = remoteLoader.loadData(repositoryUrl, params);
            return new RawJson(data);
        } catch (UnsupportedEncodingException e) {
            throw new IllegalStateException("Unable to find encoding " + Constants.UTF_8_ENCODING, e);
        }
    }

    private String getQuery(String searchExpression) {
        final String query = localLoader.loadData(Constants.FULL_TEXT_SEARCH_QUERY_FILE, Collections.emptyMap());
        return query.replace(EXPRESSION_PLACEHOLDER, "\"" + searchExpression + "\"");
    }
}
