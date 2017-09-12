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
package cz.cvut.kbss.reporting.rest;

import cz.cvut.kbss.reporting.rest.dto.model.RawJson;
import cz.cvut.kbss.reporting.rest.exception.BadRequestException;
import cz.cvut.kbss.reporting.service.ConfigReader;
import cz.cvut.kbss.reporting.service.SPARQLService;
import cz.cvut.kbss.reporting.util.ConfigParam;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/statistics")
public class StatisticsController extends BaseController {

    @Autowired
    private SPARQLService sparqlService;

    @Autowired
    private ConfigReader configReader;

    @RequestMapping(path="/{queryName}",method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    public RawJson getQueryResult(@PathVariable String queryName, @RequestParam Map<String,String> bindings) {
        if (queryName.isEmpty()) {
            throw new BadRequestException("Query name is missing.");
        }

        final String repositoryUrl = configReader.getConfig(ConfigParam.REPOSITORY_URL);
        return sparqlService.getSPARQLSelectResult("query/statistics_"+queryName+".sparql", bindings, repositoryUrl);
    }
}
