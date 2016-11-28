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
package cz.cvut.kbss.reporting.rest;

import cz.cvut.kbss.reporting.exception.NotFoundException;
import cz.cvut.kbss.reporting.model.Person;
import cz.cvut.kbss.reporting.rest.util.RestUtils;
import cz.cvut.kbss.reporting.service.PersonService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;

@RestController
@RequestMapping("/persons")
public class PersonController extends BaseController {

    @Autowired
    private PersonService personService;

    @RequestMapping(method = RequestMethod.GET, value = "/{username}", produces = MediaType.APPLICATION_JSON_VALUE)
    public Person getByUsername(@PathVariable("username") String username) {
        final Person p = personService.findByUsername(username);
        if (p == null) {
            throw NotFoundException.create("Person", username);
        }
        p.erasePassword();
        return p;
    }

    @RequestMapping(method = RequestMethod.GET, value = "/current", produces = MediaType.APPLICATION_JSON_VALUE)
    public Person getCurrent(Principal principal) {
        final String username = principal.getName();
        return getByUsername(username);
    }

    @PreAuthorize("permitAll()")
    @RequestMapping(method = RequestMethod.POST, consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Void> create(@RequestBody Person person) {
        personService.persist(person);
        if (LOG.isTraceEnabled()) {
            LOG.trace("User {} successfully registered.", person);
        }
        final HttpHeaders headers = RestUtils
                .createLocationHeaderFromCurrentUri("/{username}", person.getUsername());
        return new ResponseEntity<>(headers, HttpStatus.CREATED);
    }
}
