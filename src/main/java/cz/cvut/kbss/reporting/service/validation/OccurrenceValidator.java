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
