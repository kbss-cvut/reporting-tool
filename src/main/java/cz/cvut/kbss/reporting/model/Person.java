package cz.cvut.kbss.reporting.model;

import cz.cvut.kbss.jopa.model.annotations.*;
import cz.cvut.kbss.reporting.model.util.HasDerivableUri;
import cz.cvut.kbss.reporting.util.Constants;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.io.Serializable;
import java.net.URI;
import java.util.HashSet;
import java.util.Map;
import java.util.Set;

@OWLClass(iri = Vocabulary.s_c_Person)
public class Person implements HasDerivableUri, Serializable {

    @Id
    private URI uri;

    @ParticipationConstraints(nonEmpty = true)
    @OWLDataProperty(iri = Vocabulary.s_p_firstName)
    private String firstName;

    @ParticipationConstraints(nonEmpty = true)
    @OWLDataProperty(iri = Vocabulary.s_p_lastName)
    private String lastName;

    @ParticipationConstraints(nonEmpty = true)
    @OWLDataProperty(iri = Vocabulary.s_p_accountName)
    private String username;

    @OWLDataProperty(iri = Vocabulary.s_p_password)
    private String password;

    @Properties
    private Map<String, Set<String>> properties;

    @Types
    private Set<String> types;

    public Person() {
        this.types = new HashSet<>(4);
        // Person is an Agent
        types.add(Vocabulary.s_c_Agent);
    }

    @Override
    public URI getUri() {
        return uri;
    }

    public void setUri(URI uri) {
        this.uri = uri;
    }

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

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    /**
     * Encodes password of this person.
     *
     * @param encoder Encoder to user to encode the password
     */
    public void encodePassword(PasswordEncoder encoder) {
        if (password == null || password.isEmpty()) {
            throw new IllegalStateException("Cannot encode an empty password.");
        }
        this.password = encoder.encode(password);
    }

    /**
     * Erases the password.
     * <p>
     * Handy for example before sending the instance outside the application.
     */
    public void erasePassword() {
        this.password = null;
    }

    public Map<String, Set<String>> getProperties() {
        return properties;
    }

    public void setProperties(Map<String, Set<String>> properties) {
        this.properties = properties;
    }

    public Set<String> getTypes() {
        return types;
    }

    public void setTypes(Set<String> types) {
        this.types = types;
    }

    @Override
    public String toString() {
        return firstName + " " + lastName + " <" + uri + ">";
    }

    /**
     * Generates URI using {@link Constants#PERSON_BASE_URI} and the person's first and last name.
     *
     * If the URI is already set, nothing happens.
     */
    @Override
    public void generateUri() {
        if (uri != null) {
            return;
        }
        if (firstName == null || firstName.isEmpty()) {
            throw new IllegalStateException("Cannot generate Person URI without first name.");
        }
        if (lastName == null || lastName.isEmpty()) {
            throw new IllegalStateException("Cannot generate Person URI without last name.");
        }
        this.uri = URI.create(Constants.PERSON_BASE_URI + firstName + "+" + lastName);
    }

    /**
     * Returns true if the first name and last name of this instance are equal to those of the other instance.
     * <p>
     * Instance uri and username are not compared, because they are assumed to be read-only and password has to be
     * compared using a password encoder.
     *
     * @param other The other instance to compare to this one
     * @return true if the selected attributes are equal, false otherwise
     */
    public boolean nameEquals(Person other) {
        return other != null && firstName.equals(other.firstName) && lastName.equals(other.lastName);
    }
}
