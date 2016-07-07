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

import cz.cvut.kbss.reporting.environment.util.Generator;
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