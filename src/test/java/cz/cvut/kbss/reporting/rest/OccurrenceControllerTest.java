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

import cz.cvut.kbss.reporting.dto.OccurrenceReportDto;
import cz.cvut.kbss.reporting.environment.config.MockServiceConfig;
import cz.cvut.kbss.reporting.environment.config.MockSesamePersistence;
import cz.cvut.kbss.reporting.environment.util.Environment;
import cz.cvut.kbss.reporting.environment.util.Generator;
import cz.cvut.kbss.reporting.model.Occurrence;
import cz.cvut.kbss.reporting.model.OccurrenceReport;
import cz.cvut.kbss.reporting.rest.dto.model.OccurrenceReportDtoList;
import cz.cvut.kbss.reporting.service.OccurrenceService;
import cz.cvut.kbss.reporting.util.IdentificationUtils;
import org.junit.Before;
import org.junit.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.web.servlet.MvcResult;

import java.net.URI;
import java.util.ArrayList;
import java.util.List;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotNull;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;

@ContextConfiguration(classes = {MockServiceConfig.class, MockSesamePersistence.class})
public class OccurrenceControllerTest extends BaseControllerTestRunner {

    @Autowired
    private OccurrenceService occurrenceService;

    @Before
    public void setUp() throws Exception {
        super.setUp();
        Mockito.reset(occurrenceService);
        Environment.setCurrentUser(Generator.getPerson());
    }

    @Test
    public void findByKeyReturnsMatchingOccurrence() throws Exception {
        final Occurrence occurrence = generateOccurrence();
        when(occurrenceService.findByKey(occurrence.getKey())).thenReturn(occurrence);
        final MvcResult result = mockMvc.perform(get("/occurrences/" + occurrence.getKey())).andReturn();
        assertEquals(HttpStatus.OK, HttpStatus.valueOf(result.getResponse().getStatus()));
        final Occurrence res = readValue(result, Occurrence.class);
        assertNotNull(res);
        assertEquals(occurrence.getUri(), res.getUri());
        assertEquals(occurrence.getName(), res.getName());
    }

    private Occurrence generateOccurrence() {
        final Occurrence occurrence = Generator.generateOccurrence();
        occurrence.setKey(IdentificationUtils.generateKey());
        occurrence.setUri(URI.create("http://onto.fel.cvut.cz/ontologies/documentation/occurrence#instance12345"));
        return occurrence;
    }

    @Test
    public void findByKeyReturnsNotFoundForUnknownKey() throws Exception {
        final String unknownKey = "11223344";
        when(occurrenceService.findByKey(unknownKey)).thenReturn(null);
        final MvcResult result = mockMvc.perform(get("/occurrences/" + unknownKey)).andReturn();
        assertEquals(HttpStatus.NOT_FOUND, HttpStatus.valueOf(result.getResponse().getStatus()));
        verify(occurrenceService).findByKey(unknownKey);
    }

    @Test
    public void getOccurrenceReportsReturnsLatestRevisionsOfReportsRelatedToOccurrence() throws Exception {
        final Occurrence occurrence = generateOccurrence();
        final List<OccurrenceReport> reports = generateReportsForOccurrence(occurrence);
        when(occurrenceService.findByKey(occurrence.getKey())).thenReturn(occurrence);
        when(occurrenceService.getReports(occurrence)).thenReturn(reports);
        final MvcResult result = mockMvc.perform(get("/occurrences/" + occurrence.getKey() + "/reports").accept(
                MediaType.APPLICATION_JSON_VALUE)).andReturn();
        System.out.println(result.getResponse().getContentAsString());
        final List<OccurrenceReportDto> res = readValue(result, OccurrenceReportDtoList.class);
        assertNotNull(res);
        assertEquals(reports.size(), res.size());
        for (int i = 0; i < reports.size(); i++) {
            assertEquals(reports.get(i).getUri(), res.get(i).getUri());
            assertEquals(reports.get(i).getCorrectiveMeasures().size(),
                    res.get(i).getCorrectiveMeasures().size());
        }
    }

    private List<OccurrenceReport> generateReportsForOccurrence(Occurrence occurrence) {
        final List<OccurrenceReport> reports = new ArrayList<>();
        for (int i = 0; i < Generator.randomInt(10); i++) {
            final OccurrenceReport report = Generator.generateOccurrenceReport(true);
            report.setOccurrence(occurrence);
            report.setCorrectiveMeasures(Generator.generateCorrectiveMeasureRequests());
            reports.add(report);
        }
        return reports;
    }
}