package cz.cvut.kbss.reporting.dto;

import cz.cvut.kbss.reporting.util.Constants;
import org.junit.Test;

import java.net.URI;

import static org.junit.Assert.assertNotEquals;

public class ReportRevisionInfoTest {

    @Test
    public void twoRevisionInfosWithSameRevisionButDifferentReportsAreDifferent() {
        final ReportRevisionInfo first = new ReportRevisionInfo();
        first.setUri(URI.create("http://reportOne"));
        first.setKey("12345");
        first.setRevision(Constants.INITIAL_REVISION);

        final ReportRevisionInfo second = new ReportRevisionInfo();
        second.setUri(URI.create("http://reportTwo"));
        second.setKey("54321");
        second.setRevision(Constants.INITIAL_REVISION);
        assertNotEquals(first, second);
        assertNotEquals(first.hashCode(), second.hashCode());
    }
}