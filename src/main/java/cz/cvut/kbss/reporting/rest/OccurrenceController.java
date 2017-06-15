package cz.cvut.kbss.reporting.rest;

import cz.cvut.kbss.reporting.dto.OccurrenceReportDto;
import cz.cvut.kbss.reporting.exception.NotFoundException;
import cz.cvut.kbss.reporting.model.Occurrence;
import cz.cvut.kbss.reporting.model.OccurrenceReport;
import cz.cvut.kbss.reporting.rest.dto.mapper.DtoMapper;
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

    @RequestMapping(method = RequestMethod.GET, value = "/{key}/report", produces = MediaType.APPLICATION_JSON_VALUE)
    public OccurrenceReportDto getOccurrenceReport(@PathVariable("key") String key) {
        final Occurrence occurrence = findByKey(key);
        final OccurrenceReport report = occurrenceService.findByOccurrence(occurrence);
        assert report != null;  // Shouldn't happen, there cannot be an occurrence without report documenting it
        return mapper.occurrenceReportToOccurrenceReportDto(report);
    }
}
