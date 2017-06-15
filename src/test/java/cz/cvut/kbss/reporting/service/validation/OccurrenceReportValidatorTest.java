package cz.cvut.kbss.reporting.service.validation;

import cz.cvut.kbss.reporting.environment.generator.OccurrenceReportGenerator;
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
        final OccurrenceReport report = OccurrenceReportGenerator.generateOccurrenceReport(true);
        validator.validateForPersist(report);
    }

    @Test
    public void validReportPassesUpdateValidation() {
        final OccurrenceReport report = OccurrenceReportGenerator.generateOccurrenceReport(true);
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
        final OccurrenceReport report = OccurrenceReportGenerator.generateOccurrenceReport(true);
        report.getOccurrence().setStartTime(new Date(System.currentTimeMillis() + 10000));
        validator.validateForPersist(report);
    }

    @Test
    public void reportWithOccurrenceEndBeforeOccurrenceStartIsInvalid() {
        thrown.expect(ValidationException.class);
        thrown.expectMessage("Occurrence start cannot be after occurrence end.");
        final OccurrenceReport report = OccurrenceReportGenerator.generateOccurrenceReport(true);
        report.getOccurrence().setEndTime(new Date(report.getOccurrence().getStartTime().getTime() - 10000));
        validator.validateForPersist(report);
    }

    @Test
    public void emptyOccurrenceNameIsInvalid() {
        thrown.expect(ValidationException.class);
        thrown.expectMessage("Occurrence name cannot be empty.");
        final OccurrenceReport report = OccurrenceReportGenerator.generateOccurrenceReport(true);
        report.getOccurrence().setName("");
        validator.validateForPersist(report);
    }

    @Test
    public void occurrenceValidatorCallsNextValidatorInChain() {
        thrown.expect(ValidationException.class);
        final OccurrenceReport report = OccurrenceReportGenerator.generateOccurrenceReport(true);
        report.setKey(IdentificationUtils.generateKey());
        final OccurrenceReport copy = new OccurrenceReport(report);
        copy.setKey(IdentificationUtils.generateKey()); // The key will be different
        validator.validateForUpdate(copy, report);
    }
}