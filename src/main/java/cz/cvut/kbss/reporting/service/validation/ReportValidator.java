package cz.cvut.kbss.reporting.service.validation;

import cz.cvut.kbss.reporting.exception.ValidationException;
import cz.cvut.kbss.reporting.model.LogicalDocument;

import java.util.Objects;

public class ReportValidator extends Validator<LogicalDocument> {

    public ReportValidator() {
    }

    public ReportValidator(Validator<? super LogicalDocument> next) {
        super(next);
    }

    @Override
    public void validateForPersist(LogicalDocument instance) throws ValidationException {
        super.validateForPersist(instance);
    }

    @Override
    public void validateForUpdate(LogicalDocument toValidate, LogicalDocument original) throws ValidationException {
        Objects.requireNonNull(toValidate);
        Objects.requireNonNull(original);
        if (toValidate.getUri() != null && !toValidate.getUri().equals(original.getUri())) {
            throw new ValidationException("Instance URI cannot be modified.");
        }
        if (toValidate.getKey() == null || !toValidate.getKey().equals(original.getKey())) {
            throw new ValidationException("Instance key cannot be modified.");
        }
        if (toValidate.getAuthor() == null || toValidate.getAuthor().getUri() == null ||
                !toValidate.getAuthor().getUri().equals(original.getAuthor().getUri())) {
            throw new ValidationException("Report author cannot be different.");
        }
        if (toValidate.getDateCreated() == null || !toValidate.getDateCreated().equals(original.getDateCreated())) {
            throw new ValidationException("Report creation date cannot be modified.");
        }
        if (toValidate.getFileNumber() == null || !toValidate.getFileNumber().equals(original.getFileNumber())) {
            throw new ValidationException("Report file number cannot be modified.");
        }
        if (toValidate.getRevision() == null || !toValidate.getRevision().equals(original.getRevision())) {
            throw new ValidationException("Report revision number cannot be modified.");
        }
        super.validateForUpdate(toValidate, original);
    }
}
