package cz.cvut.kbss.reporting.service.repository;

import cz.cvut.kbss.reporting.environment.generator.Generator;
import cz.cvut.kbss.reporting.exception.UsernameExistsException;
import cz.cvut.kbss.reporting.exception.ValidationException;
import cz.cvut.kbss.reporting.model.Person;
import cz.cvut.kbss.reporting.service.BaseServiceTestRunner;
import cz.cvut.kbss.reporting.service.PersonService;
import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;

import static org.junit.Assert.assertTrue;

public class RepositoryPersonServiceTest extends BaseServiceTestRunner {

    @Autowired
    private PersonService personService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Test
    public void persistEncodesPersonPassword() {
        final Person p = Generator.getPerson();
        personService.persist(p);

        final Person result = personService.find(p.getUri());
        assertTrue(passwordEncoder.matches(Generator.PASSWORD, result.getPassword()));
    }

    @Test(expected = UsernameExistsException.class)
    public void persistThrowsUsernameExistsForUserWithDuplicateUsername() {
        final Person p = Generator.getPerson();
        personService.persist(p);
        final Person duplicate = new Person();
        duplicate.setUsername(p.getUsername());
        duplicate.setFirstName("duplicate");
        duplicate.setLastName("duplicated");
        duplicate.setPassword(Generator.PASSWORD);
        personService.persist(duplicate);
    }

    @Test(expected = ValidationException.class)
    public void persistThrowsValidationExceptionForInstanceWithoutPassword() {
        final Person p = Generator.getPerson();
        p.setPassword("");
        personService.persist(p);
    }

    @Test
    public void updateEncodesNewPassword() {
        final Person p = Generator.getPerson();
        personService.persist(p);

        final String newPassword = "masterchief";
        p.setPassword(newPassword);
        personService.update(p);

        final Person result = personService.findByUsername(p.getUsername());
        assertTrue(passwordEncoder.matches(newPassword, result.getPassword()));
    }
}