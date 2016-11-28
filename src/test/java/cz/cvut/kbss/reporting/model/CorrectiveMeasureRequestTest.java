package cz.cvut.kbss.reporting.model;

import cz.cvut.kbss.reporting.environment.generator.Generator;
import org.junit.Test;

import java.util.HashSet;
import java.util.Set;

import static org.junit.Assert.assertEquals;

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
}