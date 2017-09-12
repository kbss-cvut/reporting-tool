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

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import cz.cvut.kbss.reporting.dto.OccurrenceReportDto;
import cz.cvut.kbss.reporting.dto.event.OccurrenceDto;
import cz.cvut.kbss.reporting.environment.generator.OccurrenceReportGenerator;
import cz.cvut.kbss.reporting.environment.util.Environment;
import cz.cvut.kbss.reporting.model.LogicalDocument;
import cz.cvut.kbss.reporting.model.OccurrenceReport;
import cz.cvut.kbss.reporting.rest.dto.EventFactorsSerializationTest;
import cz.cvut.kbss.reporting.rest.dto.mapper.DtoMapper;
import cz.cvut.kbss.reporting.rest.dto.mapper.DtoMapperImpl;
import org.junit.Before;
import org.junit.Test;

import static org.junit.Assert.*;

public class OccurrenceReportDtoSerializationTest {

    private ObjectMapper mapper;
    private DtoMapper dtoMapper;

    @Before
    public void setUp() {
        this.mapper = new ObjectMapper();
        this.dtoMapper = new DtoMapperImpl();
    }

    @Test
    public void serializationUsesReferenceToOccurrenceInFactorGraph() throws Exception {
        final OccurrenceReport report = OccurrenceReportGenerator.generateOccurrenceReport(true);
        report.setOccurrence(EventFactorsSerializationTest.generateOccurrenceWithSubEvents());
        final LogicalDocument dto = dtoMapper.reportToReportDto(report);
        final String output = mapper.writeValueAsString(dto);
        final JsonNode root = mapper.readTree(output);
        final ObjectNode occurrence = (ObjectNode) root.get("occurrence");
        final String occurrenceRefId = occurrence.get("referenceId").asText();
        final ObjectNode factorGraph = (ObjectNode) root.get("factorGraph");
        final ArrayNode nodes = (ArrayNode) factorGraph.get("nodes");
        boolean found = false;
        for (int i = 0; i < nodes.size(); i++) {
            JsonNode item = nodes.get(i);
            if (item.asText().equals(occurrenceRefId)) {
                found = true;
                break;
            }
        }
        assertTrue(found);
    }

    @Test
    public void deserializationHandlesReferenceToOccurrence() throws Exception {
        final OccurrenceReportDto dto = Environment
                .loadData("data/occurrenceReportWithFactorGraph.json", OccurrenceReportDto.class);
        final OccurrenceDto occurrenceDto = dto.getOccurrence();
        assertNotNull(occurrenceDto);
        assertTrue(dto.getFactorGraph().getNodes().contains(occurrenceDto));
        final OccurrenceReport report = (OccurrenceReport) dtoMapper.reportDtoToReport(dto);
        assertEquals(occurrenceDto.getName(), report.getOccurrence().getName());
        assertFalse(report.getOccurrence().getChildren().isEmpty());
    }
}
