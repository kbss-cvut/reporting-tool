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
package cz.cvut.kbss.reporting.service.event;

import cz.cvut.kbss.reporting.model.Person;
import org.springframework.context.ApplicationEvent;

import java.util.Objects;

/**
 * Event emitted when a user exceeds the maximum number ({@link cz.cvut.kbss.reporting.security.SecurityConstants#MAX_LOGIN_ATTEMPTS})
 * of unsuccessful login attempts.
 */
public class LoginAttemptsThresholdExceeded extends ApplicationEvent {

    private final Person user;

    public LoginAttemptsThresholdExceeded(Object source, Person user) {
        super(source);
        this.user = Objects.requireNonNull(user);
    }

    /**
     * The user who exceeded unsuccessful login attempts maximum.
     *
     * @return Person instance
     */
    public Person getUser() {
        return user;
    }
}
