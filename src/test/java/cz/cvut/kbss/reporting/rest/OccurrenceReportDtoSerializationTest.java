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
