package cz.cvut.kbss.reporting.service.validation;


import cz.cvut.kbss.reporting.exception.ValidationException;

/**
 * Validator classes are designed as Chain of Responsibility.
 * <p>
 * I.e., every validator can have a successor and once it does its work (and no error occurs), it passes the validation
 * to this successor.
 *
 * @param <T> Type of the validated instance
 */
public abstract class Validator<T> {

    private Validator<? super T> next;

    public Validator() {
    }

    /**
     * Creates validator with a successor.
     *
     * @param next Next validator in chain
     */
    public Validator(Validator<? super T> next) {
        this.next = next;
    }

    /**
     * Verifies validity of the specified instance to be persisted.
     *
     * @param instance Instance to validate
     * @throws ValidationException If the validation fails
     */
    public void validateForPersist(T instance) throws ValidationException {
        if (next != null) {
            next.validateForPersist(instance);
        }
    }

    /**
     * Verifies validity of the instance to be updated.
     *
     * @param toValidate The instance, which needs to be validated prior to update
     * @param original   Original instance to be updated
     * @throws ValidationException If the validation fails
     */
    public void validateForUpdate(T toValidate, T original) throws ValidationException {
        if (next != null) {
            next.validateForUpdate(toValidate, original);
        }
    }
}
