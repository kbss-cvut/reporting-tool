package cz.cvut.kbss.reporting.model;

import cz.cvut.kbss.reporting.environment.generator.Generator;
import cz.cvut.kbss.reporting.model.qam.Question;
import org.junit.Test;

import java.net.URI;

import static org.junit.Assert.*;

public class EventTest {

    /**
     * @see Vocabulary#s_p_has_event_type
     */
    @Test
    public void setTypeAddsEventTypeUriToInstanceTypesAsWell() {
        final URI et = Generator.generateEventType();
        final Event evt = new Event();
        assertTrue(evt.getTypes() == null || evt.getTypes().isEmpty());
        evt.setEventType(et);
        assertTrue(evt.getTypes().contains(et.toString()));
    }

    @Test
    public void copyConstructorCreatesNewFormInstance() {
        final URI et = Generator.generateEventType();
        final Event evt = new Event();
        evt.setEventType(et);
        final Question q = new Question();
        q.setUri(Generator.generateEventType());
        evt.setQuestion(q);

        final Event copy = new Event(evt);
        assertNotNull(copy.getQuestion());
        assertNotSame(q, copy.getQuestion());
    }
}