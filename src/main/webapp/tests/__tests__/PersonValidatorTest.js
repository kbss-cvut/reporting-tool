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
import PersonValidator from "../../js/validation/PersonValidator";

describe("PersonValidator", () => {

    let person;

    beforeEach(() => {
        person = {
            firstName: 'firstName',
            lastName: 'lastName',
            username: 'user@rt.cz'
        };
    });

    it('marks a valid instance as valid', () => {
        expect(PersonValidator.isValid(person, false)).toBeTruthy();
    });

    it('marks instance without username as invalid', () => {
        person.username = '';
        expect(PersonValidator.isValid(person, false)).toBeFalsy();
    });

    it('marks instance without name as invalid', () => {
        person.firstName = '';
        expect(PersonValidator.isValid(person, false)).toBeFalsy();
        person.firstName = 'restored';
        delete person.lastName;
        expect(PersonValidator.isValid(person, false)).toBeFalsy();
    });

    it('marks valid instance with password update as valid', () => {
        person.password = 'pass';
        person.originalPassword = 'originalPass';
        person.passwordConfirm = 'pass';
        expect(PersonValidator.isValid(person, true)).toBeTruthy();
    });

    it('marks instance without password confirmation as invalid', () => {
        person.password = 'pass';
        person.originalPassword = 'originalPass';
        expect(PersonValidator.isValid(person, true)).toBeFalsy();
    });

    it('marks instance with password confirm not matching password as invalid', () => {
        person.password = 'pass';
        person.originalPassword = 'originalPass';
        person.passwordConfirm = 'differentPass';
        expect(PersonValidator.isValid(person, true)).toBeFalsy();
    });
});
