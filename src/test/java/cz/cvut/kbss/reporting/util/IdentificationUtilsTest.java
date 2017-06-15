package cz.cvut.kbss.reporting.util;

import cz.cvut.kbss.reporting.environment.generator.OccurrenceReportGenerator;
import cz.cvut.kbss.reporting.model.OccurrenceReport;
import org.junit.Test;

import static org.junit.Assert.*;

public class IdentificationUtilsTest {

    @Test
    public void generateIdentificationFieldsSetsRequiredIdentificationFields() {
        final OccurrenceReport report = OccurrenceReportGenerator.generateOccurrenceReport(false);
        assertNull(report.getKey());
        assertNull(report.getFileNumber());
        IdentificationUtils.generateIdentificationFields(report);
        assertNotNull(report.getKey());
        assertNotNull(report.getFileNumber());
    }

    @Test
    public void generateIdentificationUtilsLeavesFieldsUnchangedIfTheyAreAlreadySet() {
        final OccurrenceReport report = OccurrenceReportGenerator.generateOccurrenceReport(true);
        report.setKey(IdentificationUtils.generateKey());
        final String origKey = report.getKey();
        final Long origFileNo = report.getFileNumber();
        IdentificationUtils.generateIdentificationFields(report);
        assertEquals(origKey, report.getKey());
        assertEquals(origFileNo, report.getFileNumber());
    }
}
