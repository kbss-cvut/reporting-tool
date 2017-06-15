package cz.cvut.kbss.reporting.service;

import cz.cvut.kbss.reporting.model.Person;

public interface PersonService extends BaseService<Person> {

    Person findByUsername(String username);
}
