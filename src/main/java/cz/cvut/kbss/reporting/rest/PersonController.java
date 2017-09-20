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
package cz.cvut.kbss.reporting.rest;

import cz.cvut.kbss.reporting.dto.PersonUpdateDto;
import cz.cvut.kbss.reporting.exception.NotFoundException;
import cz.cvut.kbss.reporting.model.Person;
import cz.cvut.kbss.reporting.rest.dto.mapper.DtoMapper;
import cz.cvut.kbss.reporting.rest.util.RestUtils;
import cz.cvut.kbss.reporting.security.SecurityConstants;
import cz.cvut.kbss.reporting.service.PersonService;
import cz.cvut.kbss.reporting.service.security.SecurityUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.Collection;

@RestController
@RequestMapping("/persons")
public class PersonController extends BaseController {

    private final PersonService personService;

    private final SecurityUtils securityUtils;

    private final DtoMapper dtoMapper;

    @Autowired
    public PersonController(PersonService personService, SecurityUtils securityUtils, DtoMapper dtoMapper) {
        this.personService = personService;
        this.securityUtils = securityUtils;
        this.dtoMapper = dtoMapper;
    }

    @PreAuthorize("hasRole('" + SecurityConstants.ROLE_ADMIN + "')")
    @RequestMapping(method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    public Collection<Person> getAll() {
        return personService.findAll();
    }

    @RequestMapping(method = RequestMethod.GET, value = "/current", produces = MediaType.APPLICATION_JSON_VALUE)
    public Person getCurrent(Principal principal) {
        final String username = principal.getName();
        final Person p = getByUsername(username);
        p.erasePassword();
        return p;
    }

    private Person getByUsername(String username) {
        final Person p = personService.findByUsername(username);
        if (p == null) {
            throw NotFoundException.create("Person", username);
        }
        return p;
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

    @RequestMapping(value = "/current", method = RequestMethod.PUT, consumes = MediaType.APPLICATION_JSON_VALUE)
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void updateCurrentUser(@RequestBody PersonUpdateDto dto) {
        if (dto.getPassword() != null) {
            securityUtils.verifyCurrentUserPassword(dto.getPasswordOriginal());
        }
        final Person person = dtoMapper.personUpdateDtoToPerson(dto);
        personService.update(person);
        if (LOG.isDebugEnabled()) {
            LOG.debug("Person {} successfully updated.", person);
        }
    }

    @RequestMapping(value = "/exists", method = RequestMethod.GET)
    @ResponseBody
    public String doesUsernameExist(@RequestParam(name = "username") String username) {
        return Boolean.toString(personService.exists(username));
    }

    @PreAuthorize("hasRole('" + SecurityConstants.ROLE_ADMIN + "')")
    @RequestMapping(value = "/unlock", method = RequestMethod.PUT)
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void unlockUser(@RequestParam(name = "username") String username, @RequestBody String newPassword) {
        final Person user = getByUsername(username);
        personService.unlock(user, newPassword);
    }

    @PreAuthorize("hasRole('" + SecurityConstants.ROLE_ADMIN + "')")
    @RequestMapping(value = "/status", method = RequestMethod.POST)
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void enable(@RequestParam(name = "username") String username) {
        personService.enable(getByUsername(username));
    }

    @PreAuthorize("hasRole('" + SecurityConstants.ROLE_ADMIN + "')")
    @RequestMapping(value = "/status", method = RequestMethod.DELETE)
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void disable(@RequestParam(name = "username") String username) {
        personService.disable(getByUsername(username));
    }
}
