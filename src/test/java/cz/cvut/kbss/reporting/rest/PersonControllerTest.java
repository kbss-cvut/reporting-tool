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

import com.fasterxml.jackson.core.type.TypeReference;
import cz.cvut.kbss.reporting.dto.PersonUpdateDto;
import cz.cvut.kbss.reporting.environment.config.MockServiceConfig;
import cz.cvut.kbss.reporting.environment.config.MockSesamePersistence;
import cz.cvut.kbss.reporting.environment.generator.Generator;
import cz.cvut.kbss.reporting.environment.util.Environment;
import cz.cvut.kbss.reporting.exception.ValidationException;
import cz.cvut.kbss.reporting.model.Person;
import cz.cvut.kbss.reporting.model.Vocabulary;
import cz.cvut.kbss.reporting.rest.handler.ErrorInfo;
import cz.cvut.kbss.reporting.service.PersonService;
import cz.cvut.kbss.reporting.service.security.SecurityUtils;
import org.junit.Before;
import org.junit.Test;
import org.mockito.ArgumentCaptor;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.web.servlet.MvcResult;

import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.IntStream;

import static org.junit.Assert.*;
import static org.mockito.Matchers.any;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@ContextConfiguration(classes = {MockServiceConfig.class, MockSesamePersistence.class})
public class PersonControllerTest extends BaseControllerTestRunner {

    @Autowired
    private PersonService personService;

    @Autowired
    private SecurityUtils securityUtilsMock;

    @Before
    public void setUp() throws Exception {
        super.setUp();
        Mockito.reset(personService);
    }

    @Test
    public void findByUsernameThrowsNotFoundForUnknownUsername() throws Exception {
        Environment.setCurrentUser(Generator.getPerson());
        final String unknownUsername = "unknownUsername";
        when(personService.findByUsername(unknownUsername)).thenReturn(null);
        MvcResult result = mockMvc.perform(get("/persons/" + unknownUsername)).andReturn();
        assertEquals(HttpStatus.NOT_FOUND, HttpStatus.valueOf(result.getResponse().getStatus()));
        verify(personService).findByUsername(unknownUsername);
    }

    @Test
    public void getCurrentUserReturnsTheCurrentlyLoggedInUser() throws Exception {
        final Person p = Generator.getPerson();
        p.generateUri();
        Environment.setCurrentUser(p);
        when(personService.findByUsername(p.getUsername())).thenReturn(p);
        MvcResult result = mockMvc.perform(get("/persons/current").principal(Environment.getCurrentUserPrincipal()))
                                  .andReturn();
        final Person res = objectMapper.readValue(result.getResponse().getContentAsString(), Person.class);
        assertEquals(p.getUri(), res.getUri());
        assertTrue(p.nameEquals(res));
    }

    @Test
    public void createPersonPersistsNewPersonAndReturnsLocationHeader() throws Exception {
        authenticateAnonymously();
        final Person p = Generator.getPerson();
        MvcResult result = mockMvc.perform(post("/persons").content(toJson(p)).contentType(MediaType.APPLICATION_JSON))
                                  .andReturn();
        assertEquals(HttpStatus.CREATED, HttpStatus.valueOf(result.getResponse().getStatus()));
        final ArgumentCaptor<Person> captor = ArgumentCaptor.forClass(Person.class);
        verify(personService).persist(captor.capture());
        assertTrue(p.nameEquals(captor.getValue()));
        verifyLocationEquals("/persons/" + p.getUsername(), result);
    }

    private void authenticateAnonymously() {
        SecurityContext ctx = SecurityContextHolder.createEmptyContext();
        SecurityContextHolder.setContext(ctx);
        ctx.setAuthentication(new UsernamePasswordAuthenticationToken("anonymous", "",
                Collections.singletonList(new SimpleGrantedAuthority("ROLE_ANONYMOUS"))));
    }

    @Test
    public void createPersonWithoutPasswordReturnsBadRequest() throws Exception {
        authenticateAnonymously();
        final Person p = Generator.getPerson();
        p.setPassword(null);
        final String err = "Missing password.";
        doThrow(new ValidationException(err)).when(personService).persist(any(Person.class));
        MvcResult result = mockMvc.perform(post("/persons").content(toJson(p)).contentType(MediaType.APPLICATION_JSON))
                                  .andReturn();
        assertEquals(HttpStatus.CONFLICT, HttpStatus.valueOf(result.getResponse().getStatus()));
        final ErrorInfo errorInfo = readValue(result, ErrorInfo.class);
        assertNotNull(errorInfo);
        assertEquals(err, errorInfo.getMessage());
    }

    @Test
    public void updateUserUpdatedUserData() throws Exception {
        final Person person = Generator.getPerson();
        person.generateUri();
        Environment.setCurrentUser(person);
        final Person update = new Person();
        update.setUri(person.getUri());
        update.setFirstName("UpdatedFirstName");
        update.setLastName("UpdatedLastName");
        update.setUsername(person.getUsername());
        mockMvc.perform(put("/persons/current").content(toJson(update)).contentType(MediaType.APPLICATION_JSON)
                                               .principal(Environment.getCurrentUserPrincipal()))
               .andExpect(status().isNoContent());
        final ArgumentCaptor<Person> captor = ArgumentCaptor.forClass(Person.class);
        verify(personService).update(captor.capture());
        final Person argument = captor.getValue();
        assertTrue(update.nameEquals(argument));
        verify(securityUtilsMock, never()).verifyCurrentUserPassword(any());
    }

    @Test
    public void updateUserVerifiesOldPasswordWhenNewOneIsSpecified() throws Exception {
        final Person person = Generator.getPerson();
        person.generateUri();
        Environment.setCurrentUser(person);
        final TestPersonDto update = new TestPersonDto();
        update.setUri(person.getUri());
        update.setFirstName(person.getFirstName());
        update.setLastName(person.getLastName());
        update.setUsername(person.getUsername());
        update.setPassword("newPassword");
        update.setPasswordOriginal(person.getPassword());
        when(securityUtilsMock.getCurrentUser()).thenReturn(person);
        mockMvc.perform(put("/persons/current").content(toJson(update)).contentType(MediaType.APPLICATION_JSON)
                                               .principal(Environment.getCurrentUserPrincipal()))
               .andExpect(status().isNoContent());
        verify(securityUtilsMock).verifyCurrentUserPassword(update.getPasswordOriginal());
    }

    private static class TestPersonDto extends PersonUpdateDto {
        // We are using this to bypass the WRITE_ONLY access to the password property in Person
        private String password;

        @Override
        public String getPassword() {
            return password;
        }

        @Override
        public void setPassword(String password) {
            this.password = password;
        }
    }

    @Test
    public void doesUsernameExistReturnsValueForQuery() throws Exception {
        Environment.setCurrentUser(Generator.getPerson());
        when(personService.exists(anyString())).thenReturn(true);
        final String username = "masterchief";
        final MvcResult mvcResult = mockMvc
                .perform(get("/persons/exists").param("username", username).accept(MediaType.TEXT_PLAIN_VALUE))
                .andExpect(status().isOk()).andReturn();
        final String result = mvcResult.getResponse().getContentAsString();
        assertTrue(Boolean.parseBoolean(result));
        verify(personService).exists(username);
    }

    @Test
    public void findAllReturnsAllUsers() throws Exception {
        final Person user = Generator.getPerson();
        user.getTypes().add(Vocabulary.s_c_admin);
        Environment.setCurrentUser(user);
        final List<Person> persons = IntStream.range(0, 5).mapToObj(i -> {
            final Person p = new Person();
            p.setUri(Generator.generateUri());
            p.setFirstName("firstName" + i);
            p.setLastName("lastName" + i);
            p.setUsername("username" + i);
            p.setPassword("password" + i);
            return p;
        }).collect(Collectors.toList());
        when(personService.findAll()).thenReturn(persons);

        final MvcResult mvcResult = mockMvc.perform(get("/persons")).andExpect(status().isOk()).andReturn();
        final List<Person> result = readValue(mvcResult, new TypeReference<List<Person>>() {
        });
        assertEquals(persons.size(), result.size());
        for (int i = 0; i < persons.size(); i++) {
            assertEquals(persons.get(i).getUri(), result.get(i).getUri());
            assertNull(result.get(i).getPassword());
        }
    }

    @Test
    public void findAllThrowsForbiddenForUnauthorizedUser() throws Exception {
        Environment.setCurrentUser(Generator.getPerson());
        when(personService.findAll()).thenReturn(Collections.emptyList());

        mockMvc.perform(get("/persons")).andExpect(status().isForbidden());
    }
}