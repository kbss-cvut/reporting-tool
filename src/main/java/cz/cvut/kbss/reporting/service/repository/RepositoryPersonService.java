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
package cz.cvut.kbss.reporting.service.repository;

import cz.cvut.kbss.reporting.exception.AuthorizationException;
import cz.cvut.kbss.reporting.exception.UsernameExistsException;
import cz.cvut.kbss.reporting.exception.ValidationException;
import cz.cvut.kbss.reporting.model.Person;
import cz.cvut.kbss.reporting.persistence.dao.GenericDao;
import cz.cvut.kbss.reporting.persistence.dao.PersonDao;
import cz.cvut.kbss.reporting.service.PersonService;
import cz.cvut.kbss.reporting.service.event.LoginAttemptsThresholdExceeded;
import cz.cvut.kbss.reporting.service.security.SecurityUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationListener;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Objects;

@Service
public class RepositoryPersonService extends BaseRepositoryService<Person>
        implements PersonService, ApplicationListener<LoginAttemptsThresholdExceeded> {

    private final PasswordEncoder passwordEncoder;

    private final PersonDao personDao;

    private final SecurityUtils securityUtils;

    @Autowired
    public RepositoryPersonService(PersonDao personDao, PasswordEncoder passwordEncoder, SecurityUtils securityUtils) {
        this.passwordEncoder = passwordEncoder;
        this.personDao = personDao;
        this.securityUtils = securityUtils;
    }

    @Override
    protected GenericDao<Person> getPrimaryDao() {
        return personDao;
    }

    @Override
    public Person findByUsername(String username) {
        return personDao.findByUsername(username);
    }

    @Override
    protected void prePersist(Person instance) {
        if (findByUsername(instance.getUsername()) != null) {
            throw new UsernameExistsException("Username " + instance.getUsername() + " already exists.");
        }
        try {
            instance.encodePassword(passwordEncoder);
        } catch (IllegalStateException e) {
            throw new ValidationException(e.getMessage());
        }
    }

    @Override
    protected void preUpdate(Person instance) {
        final Person current = securityUtils.getCurrentUser();
        if (!current.getUri().equals(instance.getUri())) {
            throw new AuthorizationException("Modifying other user\'s account is forbidden.");
        }
        verifyUniqueUsername(instance);
        if (instance.getPassword() != null) {
            instance.encodePassword(passwordEncoder);
        } else {
            instance.setPassword(current.getPassword());
        }
    }

    private void verifyUniqueUsername(Person update) {
        final Person existing = personDao.findByUsername(update.getUsername());
        if (existing != null && !existing.getUri().equals(update.getUri())) {
            throw new UsernameExistsException("Username " + update.getUsername() + " already exists.");
        }
    }

    @Override
    protected void postUpdate(Person instance) {
        securityUtils.updateCurrentUser();
    }

    @Override
    public boolean exists(String username) {
        return findByUsername(username) != null;
    }

    @Override
    public void unlock(Person user, String newPassword) {
        Objects.requireNonNull(user);
        Objects.requireNonNull(newPassword);
        user.unlock();
        user.setPassword(newPassword);
        user.encodePassword(passwordEncoder);
        personDao.update(user);
        LOG.info("Unlocked user account {}.", user);
    }

    @Override
    public void enable(Person user) {
        Objects.requireNonNull(user);
        user.enable();
        personDao.update(user);
        LOG.info("Enabled user account {}.", user);
    }

    @Override
    public void disable(Person user) {
        Objects.requireNonNull(user);
        user.disable();
        personDao.update(user);
        LOG.info("Disabled user account {}.", user);
    }

    @Override
    public void onApplicationEvent(LoginAttemptsThresholdExceeded event) {
        final Person toDisable = personDao.find(event.getUser().getUri());
        toDisable.lock();
        personDao.update(toDisable);
        LOG.info("Locked user account {}.", toDisable);
    }
}
