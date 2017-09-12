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
package cz.cvut.kbss.reporting.dto;

import cz.cvut.kbss.reporting.dto.reportlist.ReportDto;
import cz.cvut.kbss.reporting.environment.generator.OccurrenceReportGenerator;
import cz.cvut.kbss.reporting.model.Vocabulary;
import cz.cvut.kbss.reporting.rest.dto.mapper.DtoMapper;
import cz.cvut.kbss.reporting.rest.dto.mapper.DtoMapperImpl;
import org.junit.Assert;
import org.junit.Test;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertTrue;

public class OccurrenceReportDtoTest {

    private DtoMapper dtoMapper = new DtoMapperImpl();

    @Test
    public void testToReportDto() {
        final OccurrenceReportDto dto = dtoMapper
                .occurrenceReportToOccurrenceReportDto(OccurrenceReportGenerator.generateOccurrenceReport(true));

        final ReportDto target = dto.toReportDto();
        assertTrue(target instanceof cz.cvut.kbss.reporting.dto.reportlist.OccurrenceReportDto);
        final cz.cvut.kbss.reporting.dto.reportlist.OccurrenceReportDto result = (cz.cvut.kbss.reporting.dto.reportlist.OccurrenceReportDto) target;
        assertEquals(dto.getUri(), result.getUri());
        assertEquals(dto.getKey(), result.getKey());
        assertEquals(dto.getFileNumber(), result.getFileNumber());
        assertEquals(dto.getAuthor(), result.getAuthor());
        assertEquals(dto.getDateCreated(), result.getDateCreated());
        assertEquals(dto.getLastModified(), result.getLastModified());
        assertEquals(dto.getLastModifiedBy(), result.getLastModifiedBy());
        assertEquals(dto.getRevision(), result.getRevision());
        Assert.assertEquals(dto.getOccurrence().getName(), result.getIdentification());
        Assert.assertEquals(dto.getOccurrence().getStartTime(), result.getDate());
        assertTrue(result.getTypes().containsAll(dto.getTypes()));
        assertEquals(dto.getSeverityAssessment(), result.getSeverityAssessment());
        Assert.assertEquals(dto.getOccurrence().getEventType(), result.getOccurrenceCategory());
        assertEquals(dto.getSummary(), result.getSummary());
    }

    @Test
    public void toReportDtoAddsOccurrenceReportToTypes() {
        final OccurrenceReportDto dto = dtoMapper
                .occurrenceReportToOccurrenceReportDto(OccurrenceReportGenerator.generateOccurrenceReport(true));
        final ReportDto target = dto.toReportDto();
        assertTrue(target.getTypes().contains(Vocabulary.s_c_occurrence_report));
    }
}