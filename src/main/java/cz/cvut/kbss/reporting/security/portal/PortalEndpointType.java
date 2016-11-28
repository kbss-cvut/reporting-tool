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
package cz.cvut.kbss.reporting.security.portal;

public enum PortalEndpointType {
    EMAIL_ADDRESS("emailAddress"), SCREEN_NAME("screenName"), USER_ID("userId");

    private final String name;

    PortalEndpointType(String name) {
        this.name = name;
    }

    @Override
    public String toString() {
        return name;
    }

    public static PortalEndpointType fromString(String value) {
        for (PortalEndpointType type : values()) {
            if (type.name.equalsIgnoreCase(value)) {
                return type;
            }
        }
        throw new IllegalArgumentException("Unsupported portal endpoint type " + value);
    }
}
