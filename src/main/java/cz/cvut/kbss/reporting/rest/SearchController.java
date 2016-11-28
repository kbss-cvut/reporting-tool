package cz.cvut.kbss.reporting.rest;

import cz.cvut.kbss.reporting.rest.dto.model.RawJson;
import cz.cvut.kbss.reporting.rest.exception.BadRequestException;
import cz.cvut.kbss.reporting.service.search.SearchService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/search")
public class SearchController {

    static final String EXPRESSION_PARAM = "expression";

    @Autowired
    private SearchService searchService;

    /**
     * Runs a full-text search for the specified expression.
     *
     * @param expression The expression to search for
     * @return Search results
     */
    @RequestMapping(method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    public RawJson fullTextSearch(@RequestParam(value = EXPRESSION_PARAM, defaultValue = "") String expression) {
        if (expression.isEmpty()) {
            throw new BadRequestException("Cannot search for an empty string.");
        }
        return searchService.fullTextSearch(expression);
    }
}
