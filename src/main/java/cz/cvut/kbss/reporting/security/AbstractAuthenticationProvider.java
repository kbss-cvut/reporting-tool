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
package cz.cvut.kbss.reporting.security;

import cz.cvut.kbss.reporting.model.Person;
import cz.cvut.kbss.reporting.security.model.AuthenticationToken;
import cz.cvut.kbss.reporting.service.security.LoginTracker;
import cz.cvut.kbss.reporting.service.security.SecurityUtils;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.authentication.LockedException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;

abstract class AbstractAuthenticationProvider implements AuthenticationProvider {

    final PasswordEncoder passwordEncoder;

    final SecurityUtils securityUtils;

    private final LoginTracker loginTracker;

    protected AbstractAuthenticationProvider(PasswordEncoder passwordEncoder, SecurityUtils securityUtils,
                                             LoginTracker loginTracker) {
        this.passwordEncoder = passwordEncoder;
        this.securityUtils = securityUtils;
        this.loginTracker = loginTracker;
    }

    @Override
    public boolean supports(Class<?> aClass) {
        return UsernamePasswordAuthenticationToken.class.isAssignableFrom(aClass) ||
                AuthenticationToken.class.isAssignableFrom(aClass);
    }

    void loginSuccess(Person user) {
        loginTracker.successfulLoginAttempt(user);
    }

    void loginFailure(Person user) {
        loginTracker.unsuccessfulLoginAttempt(user);
    }

    void verifyAccountStatus(Person user) {
        if (user.isLocked()) {
            throw new LockedException("Account is locked.");
        }
        if (!user.isEnabled()) {
            throw new DisabledException("Account is disabled.");
        }
    }
}
