package cz.cvut.kbss.reporting.model;

import com.fasterxml.jackson.annotation.JsonTypeInfo;
import cz.cvut.kbss.reporting.dto.reportlist.ReportDto;
import cz.cvut.kbss.reporting.model.util.HasOwlKey;
import cz.cvut.kbss.reporting.model.util.HasUri;

import java.util.Date;

/**
 * This interface represents a workaround for JOPA's lack of support for inheritance.
 * <p>
 * It enables the application to handle different kinds of reports in the same manner using some generic service. The
 * interface defines getters which all report entities have to implement, because they represent attributes common to
 * all reports. In the future, the interface should be replaced with a proper parent class, which would declare the
 * corresponding fields.
 */
@JsonTypeInfo(use = JsonTypeInfo.Id.CLASS, include = JsonTypeInfo.As.PROPERTY, property = "javaClass")
public interface LogicalDocument extends HasOwlKey, HasUri {

    /**
     * Gets number under which this report is filed.
     * <p>
     * File numbers are used to identify report chains - different revisions of the same report.
     *
     * @return File number
     */
    Long getFileNumber();

    /**
     * Sets file number of this document.
     *
     * @param fileNumber The file number to set
     */
    void setFileNumber(Long fileNumber);

    /**
     * Gets author of the report.
     *
     * @return Author
     */
    Person getAuthor();

    /**
     * Gets date when this report was created.
     *
     * @return Creation date
     */
    Date getDateCreated();

    /**
     * Gets date when this report was last modified.
     * <p>
     * If the report has not been modified yet, this method returns {@code null}, it does <b>not</b> return the creation
     * date.
     *
     * @return Date of last modification (if present)
     */
    Date getLastModified();

    /**
     * Gets author of the last modification of this report.
     * <p>
     * If the report has not been modified yet, this method returns {@code null}, it does <b>not</b> return the report
     * author.
     *
     * @return Author of last modification
     */
    Person getLastModifiedBy();

    /**
     * Gets revision number of this report.
     * <p>
     * Revision numbers start at one and are integers.
     *
     * @return Revision number
     */
    Integer getRevision();

    /**
     * Converts this logical document to a {@link ReportDto} instance, which represents an object of condensed
     * information about the report.
     *
     * @return Condensed info about this report
     */
    ReportDto toReportDto();
}
