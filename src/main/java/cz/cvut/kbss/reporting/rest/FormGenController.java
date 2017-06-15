package cz.cvut.kbss.reporting.rest;

import cz.cvut.kbss.reporting.rest.dto.mapper.GenericMapper;
import cz.cvut.kbss.reporting.rest.dto.model.FormGenData;
import cz.cvut.kbss.reporting.rest.dto.model.RawJson;
import cz.cvut.kbss.reporting.service.formgen.FormGenService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/formGen")
public class FormGenController extends BaseController {

    @Autowired
    private FormGenService formGenService;

    @Autowired
    private GenericMapper mapper;

    @RequestMapping(method = RequestMethod.POST)
    public RawJson generateForm(@RequestBody FormGenData data, @RequestParam Map<String, String> params) {
        return formGenService.generateForm(mapper.map(data), params);
    }

    @RequestMapping("/possibleValues")
    public RawJson getPossibleValues(@RequestParam("query") String query) {
        return formGenService.getPossibleValues(query);
    }
}
