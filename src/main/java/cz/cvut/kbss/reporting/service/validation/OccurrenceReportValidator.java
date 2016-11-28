package cz.cvut.kbss.reporting.service.validation;

import cz.cvut.kbss.reporting.exception.ValidationException;
import cz.cvut.kbss.reporting.model.OccurrenceReport;

import java.util.Objects;

public class OccurrenceReportValidator extends Validator<OccurrenceReport> {

    private final OccurrenceValidator occurrenceValidator = new OccurrenceValidator();

    public OccurrenceReportValidator() {
    }

    public OccurrenceReportValidator(Validator<? super OccurrenceReport> next) {
        super(next);
    }

    @Override
    public void validateForPersist(OccurrenceReport instance) throws ValidationException {
        Objects.requireNonNull(instance);
        if (instance.getOccurrence() != null) {
            occurrenceValidator.validateForPersist(instance.getOccurrence());
        }
        super.validateForPersist(instance);
    }

    @Override
    public void validateForUpdate(OccurrenceReport toValidate, OccurrenceReport original) throws ValidationException {
        Objects.requireNonNull(toValidate);
        if (toValidate.getOccurrence() != null) {
            occurrenceValidator.validateForUpdate(toValidate.getOccurrence(), original.getOccurrence());
        }
        super.validateForUpdate(toValidate, original);
    }
}
