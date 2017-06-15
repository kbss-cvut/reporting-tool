package cz.cvut.kbss.reporting.dto.reportlist;

import java.net.URI;

public class OccurrenceReportDto extends ReportDto {

    private URI severityAssessment;

    private URI occurrenceCategory;

    private String summary;

    public URI getSeverityAssessment() {
        return severityAssessment;
    }

    public void setSeverityAssessment(URI severityAssessment) {
        this.severityAssessment = severityAssessment;
    }

    public URI getOccurrenceCategory() {
        return occurrenceCategory;
    }

    public void setOccurrenceCategory(URI occurrenceCategory) {
        this.occurrenceCategory = occurrenceCategory;
    }

    public String getSummary() {
        return summary;
    }

    public void setSummary(String summary) {
        this.summary = summary;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;

        OccurrenceReportDto reportDto = (OccurrenceReportDto) o;

        return getUri().equals(reportDto.getUri());

    }

    @Override
    public int hashCode() {
        return getUri().hashCode();
    }

    @Override
    public ReportDto toReportDto() {
        return this;
    }
}
