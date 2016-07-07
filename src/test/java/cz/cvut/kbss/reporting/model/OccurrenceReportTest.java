package cz.cvut.kbss.reporting.model;

import cz.cvut.kbss.reporting.dto.reportlist.OccurrenceReportDto;
import cz.cvut.kbss.reporting.dto.reportlist.ReportDto;
import cz.cvut.kbss.reporting.environment.util.Generator;
import org.junit.Test;

import java.util.Collections;
import java.util.HashSet;
import java.util.Set;

import static org.junit.Assert.*;

public class OccurrenceReportTest {

    @Test
    public void newInstanceContainsReportInTypes() {
        final OccurrenceReport report = new OccurrenceReport();
        assertTrue(report.getTypes().contains(Vocabulary.s_c_report));
    }

    @Test
    public void copyConstructorCopiesRelevantAttributes() {
        final OccurrenceReport original = Generator.generateOccurrenceReport(true);
        final OccurrenceReport copy = new OccurrenceReport(original);

        assertNull(copy.getUri());
        assertNull(copy.getKey());
        assertNull(copy.getDateCreated());
        assertNull(copy.getAuthor());
        assertNull(copy.getLastModified());
        assertNull(copy.getLastModifiedBy());

        assertEquals(original.getFileNumber(), copy.getFileNumber());
        assertEquals(original.getPhase(), copy.getPhase());
        assertEquals(original.getOccurrence().getName(), copy.getOccurrence().getName());
        assertEquals(original.getSummary(), copy.getSummary());
        assertEquals(original.getSeverityAssessment(), copy.getSeverityAssessment());
    }

    @Test
    public void copyConstructorCreatesNewCorrectiveMeasureRequests() {
        final OccurrenceReport original = Generator.generateOccurrenceReport(true);
        final Set<CorrectiveMeasureRequest> requests = new HashSet<>();
        final CorrectiveMeasureRequest rOne = new CorrectiveMeasureRequest();
        rOne.setDescription("CorrectiveMeasureRequest_One");
        requests.add(rOne);
        final CorrectiveMeasureRequest rTwo = new CorrectiveMeasureRequest();
        rTwo.setDescription("CorrectiveMeasureRequest_Two");
        rTwo.setResponsiblePersons(Collections.singleton(Generator.getPerson()));
        requests.add(rTwo);
        original.setCorrectiveMeasures(requests);

        final OccurrenceReport copy = new OccurrenceReport(original);
        assertNotNull(copy.getCorrectiveMeasures());
        assertEquals(original.getCorrectiveMeasures().size(), copy.getCorrectiveMeasures().size());
        for (CorrectiveMeasureRequest r : original.getCorrectiveMeasures()) {
            for (CorrectiveMeasureRequest rr : copy.getCorrectiveMeasures()) {
                assertNotSame(r, rr);
            }
        }
    }

    @Test
    public void testToReportDto() {
        final OccurrenceReport report = Generator.generateOccurrenceReport(true);
        report.setPhase(Generator.generateEventType());

        final ReportDto dto = report.toReportDto();
        assertTrue(dto instanceof OccurrenceReportDto);
        final OccurrenceReportDto result = (OccurrenceReportDto) dto;
        assertEquals(report.getUri(), result.getUri());
        assertEquals(report.getKey(), result.getKey());
        assertEquals(report.getFileNumber(), result.getFileNumber());
        assertEquals(report.getPhase(), result.getPhase());
        assertEquals(report.getAuthor(), result.getAuthor());
        assertEquals(report.getDateCreated(), result.getDateCreated());
        assertEquals(report.getLastModified(), result.getLastModified());
        assertEquals(report.getLastModifiedBy(), result.getLastModifiedBy());
        assertEquals(report.getRevision(), result.getRevision());
        assertEquals(report.getOccurrence().getName(), result.getIdentification());
        assertEquals(report.getOccurrence().getStartTime(), result.getDate());
        assertTrue(result.getTypes().containsAll(report.getTypes()));
        assertEquals(report.getSeverityAssessment(), result.getSeverityAssessment());
        assertEquals(report.getOccurrence().getEventType(), result.getOccurrenceCategory());
        assertEquals(report.getSummary(), result.getSummary());
    }

    @Test
    public void toReportDtoAddsOccurrenceReportToTypes() {
        final OccurrenceReport report = Generator.generateOccurrenceReport(true);
        final ReportDto dto = report.toReportDto();
        assertTrue(dto.getTypes().contains(Vocabulary.s_c_occurrence_report));
    }
}