package cz.cvut.kbss.reporting.model;

import cz.cvut.kbss.reporting.environment.generator.Generator;
import cz.cvut.kbss.reporting.util.Constants;
import org.junit.Test;

import java.net.URI;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertTrue;

public class OrganizationTest {

    @Test
    public void newInstanceHasAgentInTypes() {
        final Organization organization = new Organization();
        assertTrue(organization.getTypes().contains(Vocabulary.s_c_Agent));
    }

    @Test(expected = IllegalStateException.class)
    public void generateUriThrowsIllegalStateWhenNameIsMissing() {
        final Organization organization = new Organization();
        organization.generateUri();
    }

    @Test
    public void generateUriHandlesSpaces() {
        final Organization organization = new Organization();
        organization.setName("Czech Airlines");
        organization.generateUri();
        assertTrue(organization.getUri().toString().endsWith("Czech+Airlines"));
    }

    @Test
    public void generateUriIsIdempotent() {
        final Organization organization = new Organization();
        organization.setName("Czech Airlines");
        final String expected = Constants.ORGANIZATION_BASE_URI + "Czech+Airlines";
        for (int i = 0; i < Generator.randomInt(10); i++) {
            organization.generateUri();
            assertEquals(expected, organization.getUri().toString());
        }
    }

    @Test
    public void generateUriDoesNotRewriteUriIfItIsAlreadyPresent() {
        final Organization organization = new Organization();
        final URI originalUri = Generator.generateUri();
        organization.setUri(originalUri);
        organization.generateUri();
        assertEquals(originalUri, organization.getUri());
    }
}
