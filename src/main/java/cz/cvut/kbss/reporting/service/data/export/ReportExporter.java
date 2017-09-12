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
package cz.cvut.kbss.reporting.service.data.export;

import cz.cvut.kbss.reporting.data.eccairs.*;
import cz.cvut.kbss.reporting.exception.NotFoundException;
import cz.cvut.kbss.reporting.model.OccurrenceReport;
import cz.cvut.kbss.reporting.service.ReportBusinessService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.w3c.dom.Document;

import javax.annotation.PostConstruct;
import javax.xml.parsers.ParserConfigurationException;
import javax.xml.validation.Schema;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.net.MalformedURLException;

@Service
public class ReportExporter {
    private static final Logger LOG = LoggerFactory.getLogger(ReportExporter.class);

    @Autowired
    protected ReportBusinessService reportService;

    private Schema e5xSchema;

    private OccurrenceReportE5XExporter occurrenceReportE5XExporter;

    @PostConstruct
    protected void init() {
        try {
            e5xSchema = XMLUtils.loadSchema(E5XTerms.DATA_BRIDGE_FILE);
            occurrenceReportE5XExporter = createExporter();
        } catch (NotFoundException e) {
            LOG.error(String.format("Could not load e5x schema from \"%s\"", E5XTerms.DATA_BRIDGE_FILE), e);
            LOG.warn("The generated e5x will not be validated.");
        }
    }

    public byte[] exportReportToE5X(String key, boolean zip) {
        LOG.debug("read report with key {}", key);
        OccurrenceReport report = reportService.findByKey(key);
        if (report == null) {
            LOG.warn("No such report with key {}.", key);
            return null;
        }

        String fileNumber = Long.toString(report.getFileNumber());

        String reportRevision = fileNumber + ":" + key;
        try {
            LOG.trace("converting report with key {} to e5x DOM", key);
            Document doc = occurrenceReportE5XExporter.convert(report);
            if (doc == null) {
                LOG.warn("Could not transform report with key {}", key);
                return null;
            }

            LOG.trace("serializing report with key {} to e5x xml", key);
            ByteArrayOutputStream reportStream = new ByteArrayOutputStream();
            XMLUtils.serializeDocument(doc, reportStream);

            LOG.trace("validating the e5x xml output");
            XMLUtils.validateDocument(E5XTerms.DATA_BRIDGE_FILE, reportRevision, doc);

            byte[] outputBytes = reportStream.toByteArray();

            if (zip) {
                LOG.trace("zipping e5x xml to e5x file");
                ByteArrayOutputStream e5xZipped = new ByteArrayOutputStream();
                AbstractOccurrenceReportE5XExporter.generateE5XFile(outputBytes, e5xZipped, reportRevision);
                outputBytes = e5xZipped.toByteArray();
            }

            return outputBytes;

        } catch (ParserConfigurationException e) {
            LOG.error(String.format(
                    "cannot convert occurrence report with key=\"%s\"to e5x xml, failed to create document builder with given configuration ",
                    key), e);
        } catch (MalformedURLException e) {
            LOG.error(String.format("cannot convert occurrence report with key=\"%s\"to e5x xml, bad schema url=\"%s\"",
                    key, E5XTerms.DATA_BRIDGE_FILE), e);
        } catch (IOException e) {
            LOG.error(String.format(
                    "cannot convert occurrence report with key=\"%s\"to e5x xml, io error while zipping e5x xml content.",
                    key), e);
        }
        return null;
    }

    protected OccurrenceReportE5XExporter createExporter() {
        return new Aso2E5X(e5xSchema);
    }
}
