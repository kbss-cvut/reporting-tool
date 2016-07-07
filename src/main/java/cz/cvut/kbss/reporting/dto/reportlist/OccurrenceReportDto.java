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
