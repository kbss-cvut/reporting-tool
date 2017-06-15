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
