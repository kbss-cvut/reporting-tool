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
package cz.cvut.kbss.reporting.service.security;

import cz.cvut.kbss.reporting.model.Person;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * Tracks login attempts.
 */
public interface LoginTracker {

    Logger LOG = LoggerFactory.getLogger(LoginTracker.class);

    /**
     * Registers an unsuccessful login attempt by the specified user.
     * <p>
     * This basically means that the user entered an incorrect password.
     *
     * @param user Use attempting to login
     */
    void unsuccessfulLoginAttempt(Person user);

    /**
     * Registers a successful login attempt by the specified user.
     * <p>
     * This basically means that the user entered the correct password and will be logged in.
     *
     * @param user User attempting to login
     */
    void successfulLoginAttempt(Person user);
}
