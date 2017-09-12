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
package cz.cvut.kbss.reporting.environment.util;

import cz.cvut.kbss.reporting.dto.reportlist.ReportDto;
import cz.cvut.kbss.reporting.model.LogicalDocument;
import cz.cvut.kbss.reporting.model.Person;

import java.net.URI;
import java.util.Date;

/**
 * Report type not supported by the application.
 */
public class UnsupportedReport implements LogicalDocument {
    @Override
    public Long getFileNumber() {
        return null;
    }

    @Override
    public void setFileNumber(Long fileNumber) {
    }

    @Override
    public Person getAuthor() {
        return null;
    }

    @Override
    public Date getDateCreated() {
        return null;
    }

    @Override
    public Date getLastModified() {
        return null;
    }

    @Override
    public Person getLastModifiedBy() {
        return null;
    }

    @Override
    public Integer getRevision() {
        return null;
    }

    @Override
    public ReportDto toReportDto() {
        return null;
    }

    @Override
    public String getKey() {
        return null;
    }

    @Override
    public void setKey(String key) {
    }

    @Override
    public URI getUri() {
        return null;
    }
}
