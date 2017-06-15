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
