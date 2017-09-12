/**
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
package cz.cvut.kbss.reporting.service;

import cz.cvut.kbss.reporting.model.Person;

public interface PersonService extends BaseService<Person> {

    /**
     * Finds instance by its username.
     *
     * @param username Username to look for
     * @return Matching instance or {@code null}
     */
    Person findByUsername(String username);

    /**
     * Checks whether an instance with the specified username exists.
     *
     * @param username Username to look for
     * @return Whether person exists
     */
    boolean exists(String username);
}
