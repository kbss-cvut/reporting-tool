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
