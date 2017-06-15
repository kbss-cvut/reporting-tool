package cz.cvut.kbss.reporting.model;

import cz.cvut.kbss.reporting.util.Constants;
import org.junit.Before;
import org.junit.Rule;
import org.junit.Test;
import org.junit.rules.ExpectedException;
import org.springframework.security.crypto.password.StandardPasswordEncoder;

import java.net.URI;

import static org.junit.Assert.*;

public class PersonTest {

    @Rule
    public ExpectedException thrown = ExpectedException.none();

    private Person person;

    @Before
    public void setUp() {
        this.person = new Person();
    }

    @Test
    public void newInstanceHasAgentInTypes() {
        assertTrue(person.getTypes().contains(Vocabulary.s_c_Agent));
    }

    @Test
    public void encodePasswordThrowsIllegalStateForNullPassword() {
        thrown.expect(IllegalStateException.class);
        thrown.expectMessage("Cannot encode an empty password.");
        person.encodePassword(new StandardPasswordEncoder());
    }

    @Test
    public void generateUriCreatesUriFromFirstNameAndLastName() {
        person.setFirstName("a");
        person.setLastName("b");
        person.generateUri();
        assertEquals(URI.create(Constants.PERSON_BASE_URI + "a+b"), person.getUri());
    }

    @Test
    public void generateUriThrowsIllegalStateForMissingFirstName() {
        thrown.expect(IllegalStateException.class);
        thrown.expectMessage("Cannot generate Person URI without first name.");
        person.setLastName("b");
        person.generateUri();
    }

    @Test
    public void generateUriThrowsIllegalStateForEmptyFirstName() {
        thrown.expect(IllegalStateException.class);
        thrown.expectMessage("Cannot generate Person URI without first name.");
        person.setFirstName("");
        person.setLastName("b");
        person.generateUri();
    }

    @Test
    public void generateUriThrowsIllegalStateForMissingLastName() {
        thrown.expect(IllegalStateException.class);
        thrown.expectMessage("Cannot generate Person URI without last name.");
        person.setFirstName("a");
        person.generateUri();
    }

    @Test
    public void generateUriThrowsIllegalStateForEmptyLastName() {
        thrown.expect(IllegalStateException.class);
        thrown.expectMessage("Cannot generate Person URI without last name.");
        person.setFirstName("a");
        person.setLastName("");
        person.generateUri();
    }

    @Test
    public void generateUriDoesNothingIfTheUriIsAlreadySet() {
        final String uri = "http://test";
        person.setUri(URI.create(uri));
        person.generateUri();
        assertEquals(uri, person.getUri().toString());
    }

    @Test
    public void nameEqualsReturnsFalseForNullOtherPerson() {
        person.setFirstName("a");
        person.setLastName("b");
        assertFalse(person.nameEquals(null));
    }

    @Test
    public void testNameEquals() {
        person.setFirstName("a");
        person.setLastName("b");
        final Person other = new Person();
        other.setFirstName("a");
        other.setLastName("b");
        assertTrue(person.nameEquals(other));
        assertTrue(other.nameEquals(person));
    }

    @Test
    public void nameEqualsTestsBothFirstAndLastName() {
        person.setFirstName("a");
        person.setLastName("b");
        final Person other = new Person();
        other.setFirstName("a");
        other.setLastName("c");
        assertFalse(person.nameEquals(other));
        other.setLastName("b");
        other.setFirstName("c");
        assertFalse(person.nameEquals(other));
    }
}