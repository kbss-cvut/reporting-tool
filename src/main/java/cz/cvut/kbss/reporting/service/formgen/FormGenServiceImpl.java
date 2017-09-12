/**
 * Copyright (C) 2017 Czech Technical University in Prague
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
package cz.cvut.kbss.reporting.service.formgen;

import cz.cvut.kbss.reporting.model.OccurrenceReport;
import cz.cvut.kbss.reporting.rest.dto.model.RawJson;
import cz.cvut.kbss.reporting.rest.util.RestUtils;
import cz.cvut.kbss.reporting.service.data.DataLoader;
import cz.cvut.kbss.reporting.util.ConfigParam;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.core.env.Environment;
import org.springframework.stereotype.Service;

import javax.annotation.PostConstruct;
import java.util.Collections;
import java.util.HashMap;
import java.util.Map;
import java.util.Objects;

@Service
public class FormGenServiceImpl implements FormGenService {

    private static final Logger LOG = LoggerFactory.getLogger(FormGenServiceImpl.class);

    // FormGen repository URL
    static final String REPOSITORY_URL_PARAM = "repositoryUrl";

    @Autowired
    private FormGenDataProcessor<OccurrenceReport> eventFormGenDataProcessor;

    @Autowired
    @Qualifier("remoteDataLoader")
    private DataLoader dataLoader;

    @Autowired
    private Environment environment;

    private final Map<Class<?>, FormGenDataProcessor<?>> dataProcessors = new HashMap<>(2);

    @PostConstruct
    private void registerProcessors() {
        dataProcessors.put(OccurrenceReport.class, eventFormGenDataProcessor);
    }

    @Override
    public <T> RawJson generateForm(T data, Map<String, String> params) {
        Objects.requireNonNull(data);
        Objects.requireNonNull(params);
        final FormGenDataProcessor<T> processor = resolveProcessor(data);
        processor.process(data, params);
        return loadFormStructure(processor);
    }

    private <T> FormGenDataProcessor<T> resolveProcessor(Object data) {
        if (!dataProcessors.containsKey(data.getClass())) {
            throw new IllegalArgumentException("Unsupported data type for form generation.");
        }
        return (FormGenDataProcessor<T>) dataProcessors.get(data.getClass());
    }

    private RawJson loadFormStructure(FormGenDataProcessor<?> processor) {
        final String serviceUrl = environment.getProperty(ConfigParam.FORM_GEN_SERVICE_URL.toString(), "");
        final String repoUrl = environment.getProperty(ConfigParam.FORM_GEN_REPOSITORY_URL.toString(), "");
        if (serviceUrl.isEmpty() || repoUrl.isEmpty()) {
            LOG.error("Form generator service URL or repository URL is missing. Service URL: {}, repository URL: {}.",
                    serviceUrl, repoUrl);
            return new RawJson("");
        }
        final Map<String, String> params = new HashMap<>(processor.getParams());
        params.put(REPOSITORY_URL_PARAM, RestUtils.encodeUrl(repoUrl));
        return new RawJson(dataLoader.loadData(serviceUrl, params));
    }

    @Override
    public RawJson getPossibleValues(String query) {
        Objects.requireNonNull(query);
        return new RawJson(dataLoader.loadData(query, Collections.emptyMap()));
    }
}
