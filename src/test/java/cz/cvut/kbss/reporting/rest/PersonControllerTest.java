package cz.cvut.kbss.reporting.rest;

import cz.cvut.kbss.reporting.environment.config.MockServiceConfig;
import cz.cvut.kbss.reporting.environment.config.MockSesamePersistence;
import cz.cvut.kbss.reporting.environment.generator.Generator;
import cz.cvut.kbss.reporting.environment.util.Environment;
import cz.cvut.kbss.reporting.exception.ValidationException;
import cz.cvut.kbss.reporting.model.Person;
import cz.cvut.kbss.reporting.rest.handler.ErrorInfo;
import cz.cvut.kbss.reporting.service.PersonService;
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

import static org.junit.Assert.*;
import static org.mockito.Matchers.any;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;

@ContextConfiguration(classes = {MockServiceConfig.class, MockSesamePersistence.class})
public class PersonControllerTest extends BaseControllerTestRunner {

    @Autowired
    private PersonService personService;

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
}