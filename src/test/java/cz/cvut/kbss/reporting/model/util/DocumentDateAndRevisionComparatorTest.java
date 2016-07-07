package cz.cvut.kbss.reporting.model.util;

import cz.cvut.kbss.reporting.model.LogicalDocument;
import cz.cvut.kbss.reporting.model.OccurrenceReport;
import org.junit.Before;
import org.junit.Test;

import java.util.Comparator;
import java.util.Date;

import static org.junit.Assert.assertTrue;

public class DocumentDateAndRevisionComparatorTest {

    private final Comparator<LogicalDocument> comparator = new DocumentDateAndRevisionComparator();

    private OccurrenceReport rOne;
    private OccurrenceReport rTwo;

    @Before
    public void setUp() {
        this.rOne = new OccurrenceReport();
        this.rTwo = new OccurrenceReport();
    }

    @Test
    public void compareWorksForInstancesWithNullDateCreated() {
        rOne.setRevision(1);
        rTwo.setRevision(2);
        assertTrue(comparator.compare(rOne, rTwo) > 0);
    }

    @Test
    public void compareReturnsLessThanZeroForFirstArgDateNull() {
        rTwo.setDateCreated(new Date());
        assertTrue(comparator.compare(rOne, rTwo) > 0);
    }

    @Test
    public void compareReturnsGreaterThanZeroForSecondArgDateNull() {
        rOne.setDateCreated(new Date());
        assertTrue(comparator.compare(rOne, rTwo) < 0);
    }

    @Test
    public void compareComparesDateCreatedByDefault() {
        rOne.setDateCreated(new Date(System.currentTimeMillis() - 1000));
        rTwo.setDateCreated(new Date());
        assertTrue(comparator.compare(rOne, rTwo) > 0);
    }
}