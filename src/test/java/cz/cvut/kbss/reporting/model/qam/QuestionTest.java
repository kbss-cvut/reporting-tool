package cz.cvut.kbss.reporting.model.qam;

import cz.cvut.kbss.reporting.environment.generator.Generator;
import org.junit.Test;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNull;

public class QuestionTest {

    @Test
    public void copyConstructorCopiesSubQuestions() {
        final Question q = new Question();
        q.setUri(Generator.generateEventType());
        q.getTypes().add(Generator.generateEventType().toString());
        for (int i = 0; i < Generator.randomInt(10); i++) {
            final Question child = new Question();
            child.setUri(Generator.generateEventType());
            q.getSubQuestions().add(child);
        }

        final Question res = new Question(q);
        assertNull(res.getUri());
        assertEquals(q.getSubQuestions().size(), res.getSubQuestions().size());
        assertEquals(q.getTypes(), res.getTypes());
    }

    @Test
    public void copyConstructorCopiesAnswers() {
        final Question q = new Question();
        for (int i = 0; i < Generator.randomInt(10); i++) {
            final Answer a = new Answer();
            a.setTextValue("Lorem ipsum");
            q.getAnswers().add(a);
        }

        final Question res = new Question(q);
        assertEquals(q.getAnswers().size(), res.getAnswers().size());
    }
}