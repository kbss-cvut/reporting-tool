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

import com.fasterxml.jackson.annotation.JsonPropertyOrder;
import cz.cvut.kbss.reporting.dto.event.FactorGraph;
import cz.cvut.kbss.reporting.dto.event.OccurrenceDto;
import cz.cvut.kbss.reporting.dto.reportlist.ReportDto;
import cz.cvut.kbss.reporting.model.*;
import cz.cvut.kbss.reporting.rest.dto.model.FormGenData;

import java.net.URI;
import java.util.Date;
import java.util.HashSet;
import java.util.Set;

// It is important that occurrence comes before factorGraph, because it defines a reference to the occurrence, which can the be used
@JsonPropertyOrder(value = {"uri, key, occurrence, factorGraph"})
public class OccurrenceReportDto implements LogicalDocument, FormGenData {

    private URI uri;

    private String key;

    private Long fileNumber;

    private URI phase;

    private OccurrenceDto occurrence;

    private InitialReport initialReport;

    private FactorGraph factorGraph;

    private Person author;

    private Date dateCreated;

    private Date lastModified;

    private Person lastModifiedBy;

    private Integer revision;

    private URI severityAssessment;

    private Set<CorrectiveMeasureRequestDto> correctiveMeasures;

    private String summary;

    private Set<Resource> references;

    private Set<String> types;

    @Override
    public URI getUri() {
        return uri;
    }

    public void setUri(URI uri) {
        this.uri = uri;
    }

    @Override
    public String getKey() {
        return key;
    }

    @Override
    public void setKey(String key) {
        this.key = key;
    }

    @Override
    public Long getFileNumber() {
        return fileNumber;
    }

    public void setFileNumber(Long fileNumber) {
        this.fileNumber = fileNumber;
    }

    public URI getPhase() {
        return phase;
    }

    public void setPhase(URI phase) {
        this.phase = phase;
    }

    public OccurrenceDto getOccurrence() {
        return occurrence;
    }

    public void setOccurrence(OccurrenceDto occurrence) {
        this.occurrence = occurrence;
    }

    public InitialReport getInitialReport() {
        return initialReport;
    }

    public void setInitialReport(InitialReport initialReport) {
        this.initialReport = initialReport;
    }

    public FactorGraph getFactorGraph() {
        return factorGraph;
    }

    public void setFactorGraph(FactorGraph factorGraph) {
        this.factorGraph = factorGraph;
    }

    @Override
    public Person getAuthor() {
        return author;
    }

    public void setAuthor(Person author) {
        this.author = author;
    }

    @Override
    public Date getDateCreated() {
        return dateCreated;
    }

    public void setDateCreated(Date dateCreated) {
        this.dateCreated = dateCreated;
    }

    @Override
    public Date getLastModified() {
        return lastModified;
    }

    public void setLastModified(Date lastModified) {
        this.lastModified = lastModified;
    }

    @Override
    public Person getLastModifiedBy() {
        return lastModifiedBy;
    }

    public void setLastModifiedBy(Person lastModifiedBy) {
        this.lastModifiedBy = lastModifiedBy;
    }

    @Override
    public Integer getRevision() {
        return revision;
    }

    public void setRevision(Integer revision) {
        this.revision = revision;
    }

    public URI getSeverityAssessment() {
        return severityAssessment;
    }

    public void setSeverityAssessment(URI severityAssessment) {
        this.severityAssessment = severityAssessment;
    }

    public Set<CorrectiveMeasureRequestDto> getCorrectiveMeasures() {
        return correctiveMeasures;
    }

    public void setCorrectiveMeasures(Set<CorrectiveMeasureRequestDto> correctiveMeasures) {
        this.correctiveMeasures = correctiveMeasures;
    }

    public Set<Resource> getReferences() {
        return references;
    }

    public void setReferences(Set<Resource> references) {
        this.references = references;
    }

    public String getSummary() {
        return summary;
    }

    public void setSummary(String summary) {
        this.summary = summary;
    }

    public Set<String> getTypes() {
        return types;
    }

    public void setTypes(Set<String> types) {
        this.types = types;
    }

    @Override
    public ReportDto toReportDto() {
        final cz.cvut.kbss.reporting.dto.reportlist.OccurrenceReportDto res = new cz.cvut.kbss.reporting.dto.reportlist.OccurrenceReportDto();
        res.setUri(uri);
        res.setKey(key);
        res.setFileNumber(fileNumber);
        res.setPhase(phase);
        res.setAuthor(author);
        res.setDateCreated(dateCreated);
        res.setLastModifiedBy(lastModifiedBy);
        res.setLastModified(lastModified);
        res.setRevision(revision);
        res.setTypes(types != null ? new HashSet<>(types) : new HashSet<>());
        res.getTypes().add(Vocabulary.s_c_occurrence_report);
        assert occurrence != null;
        res.setIdentification(occurrence.getName());
        res.setDate(occurrence.getStartTime());
        res.setSummary(summary);
        res.setSeverityAssessment(severityAssessment);
        res.setOccurrenceCategory(occurrence.getEventType());
        return res;
    }
}
