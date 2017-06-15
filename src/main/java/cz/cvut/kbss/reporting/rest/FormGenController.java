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
