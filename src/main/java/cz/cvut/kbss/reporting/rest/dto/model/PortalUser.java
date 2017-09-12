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
package cz.cvut.kbss.reporting.rest.dto.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import cz.cvut.kbss.reporting.model.Person;

@JsonIgnoreProperties(ignoreUnknown = true)
public class PortalUser {

    public static final String PORTAL_USER_ROLE = "ROLE_PORTAL_USER";

    private String firstName;

    private String lastName;

    private String emailAddress;

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public String getEmailAddress() {
        return emailAddress;
    }

    public void setEmailAddress(String emailAddress) {
        this.emailAddress = emailAddress;
    }

    public Person toPerson() {
        final Person p = new Person();
        p.setFirstName(firstName);
        p.setLastName(lastName);
        p.setUsername(emailAddress);
        p.generateUri();
        return p;
    }

    @Override
    public String toString() {
        return "PortalUser{" +
                "firstName='" + firstName + '\'' +
                ", lastName='" + lastName + '\'' +
                ", emailAddress='" + emailAddress + '\'' +
                '}';
    }
}
