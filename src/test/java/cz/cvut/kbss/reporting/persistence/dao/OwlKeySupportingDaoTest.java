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
package cz.cvut.kbss.reporting.persistence.dao;

import cz.cvut.kbss.reporting.environment.generator.Generator;
import cz.cvut.kbss.reporting.environment.generator.OccurrenceReportGenerator;
import cz.cvut.kbss.reporting.model.OccurrenceReport;
import cz.cvut.kbss.reporting.model.Person;
import cz.cvut.kbss.reporting.persistence.BaseDaoTestRunner;
import org.junit.Before;
import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;

import static org.junit.Assert.*;

public class OwlKeySupportingDaoTest extends BaseDaoTestRunner {

    @Autowired
    private OccurrenceReportDao dao;    // OccurrenceReportDao supports OWL keys

    private Person author;

    @Before
    public void setUp() {
        this.author = Generator.getPerson();
        persistPerson(author);
    }

    @Test
    public void persistGeneratesKeyForEntity() {
        final OccurrenceReport report = OccurrenceReportGenerator.generateOccurrenceReport(true);
        report.setAuthor(author);
        assertNull(report.getKey());
        dao.persist(report);
        assertNotNull(report.getKey());
    }

    @Test
    public void findByKeyReturnsInstanceWithMatchingKey() {
        final OccurrenceReport report = OccurrenceReportGenerator.generateOccurrenceReport(true);
        report.setAuthor(author);
        dao.persist(report);

        final OccurrenceReport res = dao.findByKey(report.getKey());
        assertNotNull(res);
        assertEquals(report.getUri(), res.getUri());
    }

    @Test
    public void findByKeyReturnsNullWhenNoMatchingInstanceExists() {
        assertNull(dao.findByKey("SomeRandomKey"));
    }
}