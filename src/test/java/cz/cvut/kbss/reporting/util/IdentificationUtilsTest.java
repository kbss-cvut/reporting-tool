package cz.cvut.kbss.reporting.util;

import cz.cvut.kbss.reporting.environment.util.Generator;
import cz.cvut.kbss.reporting.model.OccurrenceReport;
import org.junit.Test;

import static org.junit.Assert.*;

public class IdentificationUtilsTest {

    @Test
    public void generateIdentificationFieldsSetsRequiredIdentificationFields() {
        final OccurrenceReport report = Generator.generateOccurrenceReport(false);
        assertNull(report.getKey());
        assertNull(report.getFileNumber());
        IdentificationUtils.generateIdentificationFields(report);
        assertNotNull(report.getKey());
        assertNotNull(report.getFileNumber());
    }

    @Test
    public void generateIdentificationUtilsLeavesFieldsUnchangedIfTheyAreAlreadySet() {
        final OccurrenceReport report = Generator.generateOccurrenceReport(true);
        report.setKey(IdentificationUtils.generateKey());
        final String origKey = report.getKey();
        final Long origFileNo = report.getFileNumber();
        IdentificationUtils.generateIdentificationFields(report);
        assertEquals(origKey, report.getKey());
        assertEquals(origFileNo, report.getFileNumber());
    }
}
