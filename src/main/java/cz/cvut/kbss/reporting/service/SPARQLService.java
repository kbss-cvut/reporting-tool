/**
 * Copyright (C) 2016 Czech Technical University in Prague
 *
 * This program is free software: you can redistribute it and/or modify it under
 * the terms of the GNU General Public License as published by the Free Software
 * Foundation, either version 3 of the License, or (at your option) any
 * later version.
 *
 * This program is distributed in the hope that it will be useful, but WITHOUT
 * ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
 * FOR A PARTICULAR PURPOSE.  See the GNU General Public License for more
 * details. You should have received a copy of the GNU General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
 */
package cz.cvut.kbss.reporting.service;

import cz.cvut.kbss.reporting.rest.dto.model.RawJson;
import cz.cvut.kbss.reporting.service.data.DataLoader;
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

@Service
public class SPARQLService {

    @Autowired
    @Qualifier("remoteDataLoader")
    private DataLoader remoteLoader;

    @Autowired
    @Qualifier("localDataLoader")
    private DataLoader localLoader;

    /**
     * Executes given named SPARQL query
     *
     * @param queryFile of the SPARQL query
     * @param bindings variable bindings to be converted to VALUES block
     * @param repositoryUrl the repo for query execution
     * @return a {@link RawJson} object containing JSON-formatted SPARQL Select result.
     * @throws IllegalArgumentException When the specified queryName is not known
     */
    public RawJson getSPARQLSelectResult(final String queryFile, final Map<String,String> bindings, final String repositoryUrl) {
        return getSPARQLResult(queryFile, bindings, repositoryUrl, MediaType.APPLICATION_JSON_VALUE);
    }

    private RawJson getSPARQLResult(final String queryFile, final Map<String,String> bindings, final String repositoryUrl, final String mediaType) {
        if (repositoryUrl.isEmpty()) {
            throw new IllegalStateException("Missing repository URL configuration.");
        }
        String query = localLoader.loadData(queryFile, Collections.emptyMap());

        if (!bindings.isEmpty()) {
            query = query + " VALUES (";
            for (final String key : bindings.keySet()) {
                query = query + " ?" + key;
            }
            query = query + " )";

            query = query + " { (";
            for (final String key : bindings.keySet()) {
                query = query + " <" + bindings.get(key) + ">";
            }
            query = query + ") }";
        }

        try {
            query = URLEncoder.encode(query, Constants.UTF_8_ENCODING);
            final Map<String, String> params = new HashMap<>();
            params.put("query", query);
            params.put(HttpHeaders.ACCEPT, mediaType);
            final String data = remoteLoader.loadData(repositoryUrl, params);
            return new RawJson(data);
        } catch (UnsupportedEncodingException e) {
            throw new IllegalStateException("Unable to find encoding " + Constants.UTF_8_ENCODING, e);
        }
    }
}
