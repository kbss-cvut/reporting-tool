package cz.cvut.kbss.reporting.service;

import cz.cvut.kbss.inbas.reporting.model.Person;

public interface PersonService extends BaseService<Person> {

    Person findByUsername(String username);
}
