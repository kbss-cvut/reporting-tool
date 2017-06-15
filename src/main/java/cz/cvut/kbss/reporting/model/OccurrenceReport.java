package cz.cvut.kbss.reporting.model;

import cz.cvut.kbss.jopa.model.annotations.*;
import cz.cvut.kbss.reporting.dto.reportlist.OccurrenceReportDto;
import cz.cvut.kbss.reporting.dto.reportlist.ReportDto;

import java.io.Serializable;
import java.net.URI;
import java.util.Date;
import java.util.HashSet;
import java.util.Objects;
import java.util.Set;
import java.util.stream.Collectors;

@OWLClass(iri = Vocabulary.s_c_occurrence_report)
public class OccurrenceReport extends AbstractEntity implements LogicalDocument, Serializable {

    @ParticipationConstraints(nonEmpty = true)
    @OWLDataProperty(iri = Vocabulary.s_p_has_key)
    private String key;

    /**
     * File number identifies a particular report chain, i.e. revisions of the same report.
     */
    @ParticipationConstraints(nonEmpty = true)
    @OWLDataProperty(iri = Vocabulary.s_p_has_file_number)
    private Long fileNumber;

    @OWLObjectProperty(iri = Vocabulary.s_p_has_reporting_phase)
    private URI phase;

    @ParticipationConstraints(nonEmpty = true)
    @OWLObjectProperty(iri = Vocabulary.s_p_documents, fetch = FetchType.EAGER)
    private Occurrence occurrence;

    @OWLObjectProperty(iri = Vocabulary.s_p_based_on, cascade = CascadeType.REMOVE, fetch = FetchType.EAGER, readOnly = true)
    private InitialReport initialReport;

    @ParticipationConstraints(nonEmpty = true)
    @OWLObjectProperty(iri = Vocabulary.s_p_has_author, fetch = FetchType.EAGER)
    private Person author;

    @OWLDataProperty(iri = Vocabulary.s_p_created)
    private Date dateCreated;

    @OWLDataProperty(iri = Vocabulary.s_p_modified)
    private Date lastModified;

    @OWLObjectProperty(iri = Vocabulary.s_p_has_last_editor, fetch = FetchType.EAGER)
    private Person lastModifiedBy;

    @ParticipationConstraints(nonEmpty = true)
    @OWLDataProperty(iri = Vocabulary.s_p_has_revision)
    private Integer revision;

    @OWLObjectProperty(iri = Vocabulary.s_p_has_severity_assessment)
    private URI severityAssessment;

    @OWLObjectProperty(iri = Vocabulary.s_p_has_corrective_measure, cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    private Set<CorrectiveMeasureRequest> correctiveMeasures;

    @OWLObjectProperty(iri = Vocabulary.s_p_references, cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    private Set<Resource> references;

    @OWLDataProperty(iri = Vocabulary.s_p_description)
    private String summary;

    @Types
    private Set<String> types;

    public OccurrenceReport() {
        this.types = new HashSet<>(4);
        types.add(Vocabulary.s_c_report);
    }

    public OccurrenceReport(OccurrenceReport other) {
        this();
        Objects.requireNonNull(other);
        this.fileNumber = other.fileNumber;
        this.phase = other.phase;
        this.occurrence = Occurrence.copyOf(other.occurrence);
        this.initialReport = other.initialReport;
        this.severityAssessment = other.severityAssessment;
        this.summary = other.summary;
        if (other.correctiveMeasures != null) {
            this.correctiveMeasures = other.correctiveMeasures.stream().map(CorrectiveMeasureRequest::new)
                                                              .collect(Collectors.toSet());
        }
        if (other.references != null) {
            this.references = other.references.stream().map(Resource::new).collect(Collectors.toSet());
        }
    }

    public String getKey() {
        return key;
    }

    public void setKey(String key) {
        this.key = key;
    }

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

    public Occurrence getOccurrence() {
        return occurrence;
    }

    public void setOccurrence(Occurrence occurrence) {
        this.occurrence = occurrence;
    }

    public InitialReport getInitialReport() {
        return initialReport;
    }

    public void setInitialReport(InitialReport initialReport) {
        this.initialReport = initialReport;
    }

    public Person getAuthor() {
        return author;
    }

    public void setAuthor(Person author) {
        this.author = author;
    }

    public Date getDateCreated() {
        return dateCreated;
    }

    public void setDateCreated(Date dateCreated) {
        this.dateCreated = dateCreated;
    }

    public Date getLastModified() {
        return lastModified;
    }

    public void setLastModified(Date lastModified) {
        this.lastModified = lastModified;
    }

    public Person getLastModifiedBy() {
        return lastModifiedBy;
    }

    public void setLastModifiedBy(Person lastModifiedBy) {
        this.lastModifiedBy = lastModifiedBy;
    }

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

    public Set<CorrectiveMeasureRequest> getCorrectiveMeasures() {
        return correctiveMeasures;
    }

    public void setCorrectiveMeasures(Set<CorrectiveMeasureRequest> correctiveMeasures) {
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
    public String toString() {
        return "OccurrenceReport{" +
                "uri=" + uri +
                ", fileNumber=" + fileNumber +
                ", revision=" + revision +
                ", occurrence=" + occurrence +
                '}';
    }

    @Override
    public ReportDto toReportDto() {
        final OccurrenceReportDto res = new OccurrenceReportDto();
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
