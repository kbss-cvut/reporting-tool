/*
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
export default class PersonValidator {

    /**
     * Checks whether the specified person instance is valid, i.e. it contains all the required attribute values.
     * @param person The instance to check
     * @param withPassword Whether to include password presence and match to confirmation in the validation
     */
    static isValid(person, withPassword = true) {
        if (!person.firstName || !person.lastName || !person.username) {
            return false;
        }
        if (withPassword && (!person.password || person.password !== person.passwordConfirm)) {
            return false;
        }
        return true;
    }
}