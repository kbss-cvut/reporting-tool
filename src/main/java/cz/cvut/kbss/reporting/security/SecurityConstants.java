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

import cz.cvut.kbss.reporting.model.Vocabulary;

public class SecurityConstants {

    public static final String SESSION_COOKIE_NAME = "INBAS_JSESSIONID";

    public static final String REMEMBER_ME_COOKIE_NAME = "remember-me";

    public static final String CSRF_COOKIE_NAME = "CSRF-TOKEN";

    public static final String USERNAME_PARAM = "username";

    public static final String PASSWORD_PARAM = "password";

    public static final String SECURITY_CHECK_URI = "/j_spring_security_check";

    public static final String LOGOUT_URI = "/j_spring_security_logout";

    public static final String COOKIE_URI = "/";

    /**
     * Session timeout in seconds. 30 minutes.
     */
    public static final int SESSION_TIMEOUT = 30 * 60;

    /**
     * Maximum number of unsuccessful login attempts.
     */
    public static final int MAX_LOGIN_ATTEMPTS = 5;

    public static final String ROLE_ADMIN = "ROLE_ADMIN";

    public static final String ROLE_USER = "ROLE_USER";

    /**
     * Represents user roles in the system.
     * <p>
     * These roles are used for authorization.
     */
    public enum Role {
        USER(Vocabulary.s_c_regular_user, ROLE_USER),
        ADMIN(Vocabulary.s_c_admin, ROLE_ADMIN);

        private final String type;
        private final String name;

        Role(String type, String name) {
            this.type = type;
            this.name = name;
        }

        public String getName() {
            return name;
        }

        /**
         * Checks whether a role for the specified type exists.
         *
         * @param type The type to check
         * @return Role existence info
         */
        public static boolean exists(String type) {
            for (Role r : values()) {
                if (r.type.equals(type)) {
                    return true;
                }
            }
            return false;
        }

        /**
         * Gets role for the specified ontological type.
         *
         * @param type Type to get role for
         * @return Matching role
         * @throws IllegalArgumentException If no matching role exists
         */
        public static Role fromType(String type) {
            for (Role r : values()) {
                if (r.type.equals(type)) {
                    return r;
                }
            }
            throw new IllegalArgumentException("No role found for type " + type + ".");
        }
    }

    private SecurityConstants() {
        throw new AssertionError();
    }
}
