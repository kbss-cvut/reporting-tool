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
package cz.cvut.kbss.reporting.service.validation;

import cz.cvut.kbss.reporting.environment.util.Generator;
import cz.cvut.kbss.reporting.exception.ValidationException;
import cz.cvut.kbss.reporting.model.OccurrenceReport;
import cz.cvut.kbss.reporting.model.Vocabulary;
import cz.cvut.kbss.reporting.util.IdentificationUtils;
import org.junit.Rule;
import org.junit.Test;
import org.junit.rules.ExpectedException;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

import java.net.URI;
import java.util.Date;

@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration(classes = {ValidatorFactory.class})
public class OccurrenceReportValidatorTest {

    @Rule
    public ExpectedException thrown = ExpectedException.none();

    @Autowired
    private OccurrenceReportValidator validator;

    @Test
    public void validReportPassesPersistValidation() {
        final OccurrenceReport report = Generator.generateOccurrenceReport(true);
        validator.validateForPersist(report);
    }

    @Test
    public void validReportPassesUpdateValidation() {
        final OccurrenceReport report = Generator.generateOccurrenceReport(true);
        report.setKey(IdentificationUtils.generateKey());
        report.setUri(URI.create(Vocabulary.s_c_occurrence_report + "#instance"));
        report.getAuthor().generateUri();
        final OccurrenceReport copy = new OccurrenceReport(report);
        copy.setKey(report.getKey());
        copy.setUri(report.getUri());
        copy.setAuthor(report.getAuthor());
        copy.setDateCreated(report.getDateCreated());
        copy.setRevision(report.getRevision());
        validator.validateForUpdate(copy, report);
    }

    @Test
    public void reportWithFutureOccurrenceStartIsInvalid() {
        thrown.expect(ValidationException.class);
        thrown.expectMessage("Occurrence start cannot be in the future.");
        final OccurrenceReport report = Generator.generateOccurrenceReport(true);
        report.getOccurrence().setStartTime(new Date(System.currentTimeMillis() + 10000));
        validator.validateForPersist(report);
    }

    @Test
    public void reportWithOccurrenceEndBeforeOccurrenceStartIsInvalid() {
        thrown.expect(ValidationException.class);
        thrown.expectMessage("Occurrence start cannot be after occurrence end.");
        final OccurrenceReport report = Generator.generateOccurrenceReport(true);
        report.getOccurrence().setEndTime(new Date(report.getOccurrence().getStartTime().getTime() - 10000));
        validator.validateForPersist(report);
    }

    @Test
    public void emptyOccurrenceNameIsInvalid() {
        thrown.expect(ValidationException.class);
        thrown.expectMessage("Occurrence name cannot be empty.");
        final OccurrenceReport report = Generator.generateOccurrenceReport(true);
        report.getOccurrence().setName("");
        validator.validateForPersist(report);
    }

    @Test
    public void occurrenceValidatorCallsNextValidatorInChain() {
        thrown.expect(ValidationException.class);
        final OccurrenceReport report = Generator.generateOccurrenceReport(true);
        report.setKey(IdentificationUtils.generateKey());
        final OccurrenceReport copy = new OccurrenceReport(report);
        copy.setKey(IdentificationUtils.generateKey()); // The key will be different
        validator.validateForUpdate(copy, report);
    }
}