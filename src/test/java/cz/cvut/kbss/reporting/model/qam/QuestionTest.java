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