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

import cz.cvut.kbss.reporting.exception.NotFoundException;
import cz.cvut.kbss.reporting.model.Occurrence;
import cz.cvut.kbss.reporting.model.OccurrenceReport;
import cz.cvut.kbss.reporting.rest.dto.mapper.DtoMapper;
import cz.cvut.kbss.reporting.rest.dto.model.OccurrenceReportDtoList;
import cz.cvut.kbss.reporting.service.OccurrenceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import java.util.Collection;

@RestController
@RequestMapping(value = "/occurrences")
public class OccurrenceController extends BaseController {

    @Autowired
    private OccurrenceService occurrenceService;

    @Autowired
    private DtoMapper mapper;

    @RequestMapping(method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    public Collection<Occurrence> getOccurrences() {
        return occurrenceService.findAll();
    }

    @RequestMapping(method = RequestMethod.GET, value = "/{key}", produces = MediaType.APPLICATION_JSON_VALUE)
    public Occurrence findByKey(@PathVariable("key") String key) {
        final Occurrence o = occurrenceService.findByKey(key);
        if (o == null) {
            throw NotFoundException.create("Occurrence", key);
        }
        return o;
    }

    @RequestMapping(method = RequestMethod.GET, value = "/{key}/reports", produces = MediaType.APPLICATION_JSON_VALUE)
    public OccurrenceReportDtoList getOccurrenceReports(@PathVariable("key") String key) {
        final Occurrence occurrence = findByKey(key);
        final Collection<OccurrenceReport> reports = occurrenceService.getReports(occurrence);
        final OccurrenceReportDtoList list = new OccurrenceReportDtoList(reports.size());
        reports.forEach(r -> list.add(mapper.occurrenceReportToOccurrenceReportDto(r)));
        return list;
    }
}
