package cz.cvut.kbss.reporting.model;

import cz.cvut.kbss.reporting.environment.generator.Generator;
import org.junit.Test;

import java.util.HashSet;
import java.util.Set;

import static cz.cvut.kbss.reporting.util.Constants.DESCRIPTION_TO_STRING_THRESHOLD;
import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertTrue;

public class CorrectiveMeasureRequestTest {

    @Test
    public void copyConstructorReusesResponsiblePersonsAndOrganizations() {
        final CorrectiveMeasureRequest original = new CorrectiveMeasureRequest();
        original.setDescription("Blablabla corrective measure request");
        original.setResponsiblePersons(generateResponsiblePersons());
        original.setResponsibleOrganizations(generateResponsibleOrganizations());

        final CorrectiveMeasureRequest copy = new CorrectiveMeasureRequest(original);
        assertEquals(original.getDescription(), copy.getDescription());
        assertEquals(original.getResponsiblePersons(), copy.getResponsiblePersons());
        assertEquals(original.getResponsibleOrganizations(), copy.getResponsibleOrganizations());
    }

    private Set<Person> generateResponsiblePersons() {
        final Set<Person> persons = new HashSet<>();
        for (int i = 0; i < Generator.randomInt(10); i++) {
            final Person p = new Person();
            p.setFirstName("firstName" + i);
            p.setLastName("lastName" + i);
            p.setUsername("username" + i);
            persons.add(p);
        }
        return persons;
    }

    private Set<Organization> generateResponsibleOrganizations() {
        final Set<Organization> organizations = new HashSet<>();
        for (int i = 0; i < Generator.randomInt(10); i++) {
            organizations.add(new Organization("Organization-part-" + i));
        }
        return organizations;
    }

    @Test
    public void copyConstructorReusesRelatedOccurrence() {
        final CorrectiveMeasureRequest original = new CorrectiveMeasureRequest();
        original.setDescription("blabla");
        final Occurrence occurrence = new Occurrence();
        occurrence.setName("Runway incursion");
        occurrence.setKey("12345");
        original.setBasedOnOccurrence(occurrence);

        final CorrectiveMeasureRequest copy = new CorrectiveMeasureRequest(original);
        assertEquals(original.getDescription(), copy.getDescription());
        assertEquals(original.getBasedOnOccurrence(), copy.getBasedOnOccurrence());
    }

    @Test
    public void toStringRenders50CharactersOfDescriptionAtMaximum() {
        final CorrectiveMeasureRequest request = new CorrectiveMeasureRequest();
        request.setDescription(
                "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt" +
                        " ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi" +
                        " ut aliquip ex ea commodo consequat.");
        final String result = request.toString();
        assertTrue(result.length() <=
                DESCRIPTION_TO_STRING_THRESHOLD + CorrectiveMeasureRequest.class.getSimpleName().length() + 5);
        assertTrue(result.contains(request.getDescription().substring(0, DESCRIPTION_TO_STRING_THRESHOLD)));
    }

    @Test
    public void toStringRendersUriWhenDescriptionIsNotAvailable() {
        final CorrectiveMeasureRequest request = new CorrectiveMeasureRequest();
        request.setUri(Generator.generateUri());
        request.setDescription(null);
        final String result = request.toString();
        assertTrue(result.contains(request.getUri().toString()));
    }
}
