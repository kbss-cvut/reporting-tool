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