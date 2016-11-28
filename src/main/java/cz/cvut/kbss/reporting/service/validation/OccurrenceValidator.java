package cz.cvut.kbss.reporting.service.validation;

import cz.cvut.kbss.reporting.exception.ValidationException;
import cz.cvut.kbss.reporting.model.Occurrence;

import java.util.Date;

public class OccurrenceValidator extends Validator<Occurrence> {

    @Override
    public void validateForPersist(Occurrence instance) throws ValidationException {
        validate(instance);
    }

    private void validate(Occurrence occurrence) {
        if (occurrence.getStartTime() != null) {
            if (occurrence.getStartTime().compareTo(new Date()) >= 0) {
                throw new ValidationException("Occurrence start cannot be in the future.");
            }
            if (occurrence.getEndTime() != null &&
                    occurrence.getStartTime().compareTo(occurrence.getEndTime()) > 0) {
                throw new ValidationException("Occurrence start cannot be after occurrence end.");
            }
        }
        if (occurrence.getName() == null || occurrence.getName().isEmpty()) {
            throw new ValidationException("Occurrence name cannot be empty.");
        }
    }

    @Override
    public void validateForUpdate(Occurrence toValidate, Occurrence original) throws ValidationException {
        validate(toValidate);
    }
}
