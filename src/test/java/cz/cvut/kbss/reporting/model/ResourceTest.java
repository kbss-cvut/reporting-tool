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
package cz.cvut.kbss.reporting.model;

import cz.cvut.kbss.reporting.environment.generator.Generator;
import org.junit.Test;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNull;

public class ResourceTest {

    @Test
    public void copyConstructorCopiesAttributes() {
        final Resource original = new Resource();
        original.setUri(Generator.generateUri());
        original.setReference(Generator.generateUri().toString());
        original.setDescription("Resource description.");

        final Resource copy = new Resource(original);
        assertEquals(original.getReference(), copy.getReference());
        assertEquals(original.getDescription(), copy.getDescription());
        assertNull(copy.getUri());
    }
}
