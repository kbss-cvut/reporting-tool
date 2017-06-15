package cz.cvut.kbss.reporting.service.repository;

import cz.cvut.kbss.reporting.exception.UsernameExistsException;
import cz.cvut.kbss.reporting.exception.ValidationException;
import cz.cvut.kbss.reporting.model.Person;
import cz.cvut.kbss.reporting.persistence.dao.GenericDao;
import cz.cvut.kbss.reporting.persistence.dao.PersonDao;
import cz.cvut.kbss.reporting.service.PersonService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class RepositoryPersonService extends BaseRepositoryService<Person> implements PersonService {

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private PersonDao personDao;

    @Override
    protected GenericDao<Person> getPrimaryDao() {
        return personDao;
    }

    @Override
    public Person findByUsername(String username) {
        return personDao.findByUsername(username);
    }

    public void persist(Person person) {
        if (findByUsername(person.getUsername()) != null) {
            throw new UsernameExistsException("Username " + person.getUsername() + " already exists.");
        }
        try {
            person.encodePassword(passwordEncoder);
        } catch (IllegalStateException e) {
            throw new ValidationException(e.getMessage());
        }
        personDao.persist(person);
    }

    @Override
    public void update(Person instance) {
        final Person orig = personDao.find(instance.getUri());
        if (orig == null) {
            throw new IllegalArgumentException("Cannot update person URI.");
        }
        if (!orig.getPassword().equals(instance.getPassword())) {
            instance.encodePassword(passwordEncoder);
        }
        personDao.update(instance);
    }
}
