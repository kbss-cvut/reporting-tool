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
