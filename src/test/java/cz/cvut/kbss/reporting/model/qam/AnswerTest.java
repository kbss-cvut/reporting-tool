package cz.cvut.kbss.reporting.model.qam;

import cz.cvut.kbss.reporting.environment.generator.Generator;
import org.junit.Test;

import java.net.URI;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNull;

public class AnswerTest {

    @Test
    public void copyConstructorsCopiesValuesAndTypes() {
        final Answer a = new Answer();
        a.setTextValue("Master Chief");
        a.setCodeValue(URI.create("http://117"));
        a.getTypes().add(Generator.generateEventType().toString());

        final Answer res = new Answer(a);
        assertNull(res.getUri());
        assertEquals(a.getTextValue(), res.getTextValue());
        assertEquals(a.getCodeValue(), res.getCodeValue());
        assertEquals(a.getTypes(), res.getTypes());
    }
}