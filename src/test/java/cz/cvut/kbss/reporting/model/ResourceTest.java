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
