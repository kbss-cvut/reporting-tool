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

import cz.cvut.kbss.reporting.dto.ReportRevisionInfo;
import cz.cvut.kbss.reporting.dto.reportlist.ReportDto;
import cz.cvut.kbss.reporting.dto.reportlist.ReportList;
import cz.cvut.kbss.reporting.exception.NotFoundException;
import cz.cvut.kbss.reporting.model.LogicalDocument;
import cz.cvut.kbss.reporting.rest.dto.mapper.DtoMapper;
import cz.cvut.kbss.reporting.rest.exception.BadRequestException;
import cz.cvut.kbss.reporting.rest.util.RestUtils;
import cz.cvut.kbss.reporting.service.ReportBusinessService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.util.MultiValueMap;
import org.springframework.web.bind.annotation.*;

import java.util.Collection;
import java.util.List;

@RestController
@RequestMapping("/reports")
public class ReportController extends BaseController {

    private static final String REPORT_KEY_PARAM = "key";

    @Autowired
    @Qualifier("cachingReportBusinessService")
    private ReportBusinessService reportService;

    @Autowired
    private DtoMapper dtoMapper;

    @RequestMapping(method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    public ReportList getAllReports(@RequestParam MultiValueMap<String, String> params) {
        if (params.containsKey(REPORT_KEY_PARAM)) {
            final Collection<String> keys = params.get(REPORT_KEY_PARAM);
            return new ReportList(reportService.findAll(keys));
        }
        return new ReportList(reportService.findAll());
    }

    @RequestMapping(method = RequestMethod.POST, consumes = MediaType.APPLICATION_JSON_VALUE)
    @ResponseStatus(HttpStatus.CREATED)
    public ResponseEntity<Void> createReport(@RequestBody LogicalDocument reportDto) {
        final LogicalDocument report = dtoMapper.reportDtoToReport(reportDto);
        reportService.persist(report);
        if (LOG.isTraceEnabled()) {
            LOG.trace("Report {} successfully persisted.", report);
        }
        final String key = report.getKey();
        final HttpHeaders headers = RestUtils.createLocationHeaderFromCurrentUri("/{key}", key);
        return new ResponseEntity<>(headers, HttpStatus.CREATED);
    }

    @RequestMapping(value = "/{key}", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    public LogicalDocument getReport(@PathVariable("key") String key) {
        return dtoMapper.reportToReportDto(getReportInternal(key));
    }

    private LogicalDocument getReportInternal(String key) {
        final LogicalDocument report = reportService.findByKey(key);
        if (report == null) {
            throw NotFoundException.create("Occurrence report", key);
        }
        return report;
    }

    @RequestMapping(value = "/{key}", method = RequestMethod.PUT, consumes = MediaType.APPLICATION_JSON_VALUE)
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void updateReport(@PathVariable("key") String key, @RequestBody LogicalDocument reportUpdate) {
        if (!key.equals(reportUpdate.getKey())) {
            throw new BadRequestException("The passed report's key is different from the specified one.");
        }
        final LogicalDocument report = dtoMapper.reportDtoToReport(reportUpdate);
        if (reportService.findByKey(key) == null) {
            throw NotFoundException.create("Report", key);
        }
        reportService.update(report);
        if (LOG.isTraceEnabled()) {
            LOG.trace("Updated report {}.", report);
        }
    }

    @RequestMapping(value = "/{key}/phase", method = RequestMethod.PUT)
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void transitionToNextPhase(@PathVariable("key") String key) {
        final LogicalDocument report = getReportInternal(key);
        reportService.transitionToNextPhase(report);
    }

    @RequestMapping(value = "/chain/{fileNumber}", method = RequestMethod.DELETE)
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void removeChain(@PathVariable("fileNumber") Long fileNumber) {
        reportService.removeReportChain(fileNumber);
    }

    @RequestMapping(value = "/chain/{fileNumber}", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    public LogicalDocument findLatestRevision(@PathVariable("fileNumber") Long fileNumber) {
        final LogicalDocument report = reportService.findLatestRevision(fileNumber);
        if (report == null) {
            throw NotFoundException.create("Report chain", fileNumber);
        }
        return dtoMapper.reportToReportDto(report);
    }

    @RequestMapping(value = "/chain/{fileNumber}/revisions", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    public List<ReportRevisionInfo> getReportChainRevisions(@PathVariable("fileNumber") Long fileNumber) {
        final List<ReportRevisionInfo> revisions = reportService.getReportChainRevisions(fileNumber);
        if (revisions.isEmpty()) {
            throw NotFoundException.create("Report chain", fileNumber);
        }
        return revisions;
    }

    /**
     * Creates new revision in the report chain (of the same type as the latest revision) or starts investigation (from
     * latest preliminary report).
     *
     * @param fileNumber Report chain identifier
     * @return Response with location header pointing to the new report
     */
    @RequestMapping(value = "/chain/{fileNumber}/revisions", method = RequestMethod.POST)
    @ResponseStatus(HttpStatus.CREATED)
    public ResponseEntity<Void> createNewRevision(@PathVariable("fileNumber") Long fileNumber) {
        final LogicalDocument newRevision = reportService.createNewRevision(fileNumber);
        final HttpHeaders headers = RestUtils
                .createLocationHeaderFromContextPath("/reports/{key}", newRevision.getKey());
        return new ResponseEntity<>(headers, HttpStatus.CREATED);
    }

    @RequestMapping(value = "/chain/{fileNumber}/revisions/{revision}", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    public LogicalDocument getRevision(@PathVariable("fileNumber") Long fileNumber,
                                       @PathVariable("revision") Integer revision) {
        final LogicalDocument report = reportService.findRevision(fileNumber, revision);
        if (report == null) {
            throw new NotFoundException(
                    "Report with revision " + revision + " not found in report chain with file number " + fileNumber +
                            " or the report chain does not exist.");
        }
        return dtoMapper.reportToReportDto(report);
    }
}
