package cz.cvut.kbss.reporting.environment.generator;

import cz.cvut.kbss.reporting.model.CorrectiveMeasureRequest;
import cz.cvut.kbss.reporting.model.Organization;
import cz.cvut.kbss.reporting.model.Person;
import cz.cvut.kbss.reporting.model.Vocabulary;
import cz.cvut.kbss.reporting.model.qam.Answer;
import cz.cvut.kbss.reporting.model.qam.Question;

import java.net.URI;
import java.util.*;

public class Generator {

    public static final String USERNAME = "halsey@unsc.org";
    public static final String PASSWORD = "john117";

    public static final URI[] FACTOR_TYPES = {
            URI.create("http://onto.fel.cvut.cz/ontologies/aviation-safety/causes"),
            URI.create("http://onto.fel.cvut.cz/ontologies/aviation-safety/mitigates"),
            URI.create("http://onto.fel.cvut.cz/ontologies/aviation-safety/contributes_to")
    };

    private static Random random = new Random();

    private Generator() {
        throw new AssertionError();
    }

    /**
     * Generates a (pseudo) unique event type URI.
     *
     * @return EventType instance
     */
    public static URI generateEventType() {
        return URI.create("http://onto.fel.cvut.cz/ontologies/eccairs-3.4.0.2/vl-a-390/v-" + randomInt());
    }

    /**
     * Generates a (pseudo) random URI, usable for test individuals.
     *
     * @return Random URI
     */
    public static URI generateUri() {
        return URI.create(Vocabulary.ONTOLOGY_IRI_model + "/randomInstance" + randomInt());
    }

    public static Person getPerson() {
        final Person person = new Person();
        person.setFirstName("Catherine");
        person.setLastName("Halsey");
        person.setUsername(USERNAME);
        person.setPassword(PASSWORD);
        return person;
    }

    /**
     * Generates {@link Organization} with a random name.
     *
     * @return Organization
     */
    public static Organization generateOrganization() {
        final Organization org = new Organization();
        org.setName(UUID.randomUUID().toString());
        org.generateUri();
        return org;
    }

    /**
     * Generates a (pseudo-)random integer between 0 and the specified upper bound.
     * <p>
     * <b>IMPORTANT</b>: The lower bound (0) is not included in the generator output, so the smallest number this
     * generator returns is 1.
     *
     * @param upperBound Upper bound of the generated number
     * @return Randomly generated integer
     */
    public static int randomInt(int upperBound) {
        int rand;
        do {
            rand = random.nextInt(upperBound);
        } while (rand == 0);
        return rand;
    }

    /**
     * Generates a (pseudo-)random integer between the specified lower and upper bounds.
     *
     * @param lowerBound Lower bound, inclusive
     * @param upperBound Upper bound, exclusive
     * @return Randomly generated integer
     */
    public static int randomInt(int lowerBound, int upperBound) {
        int rand;
        do {
            rand = random.nextInt(upperBound);
        } while (rand < lowerBound);
        return rand;
    }

    /**
     * Generates a (pseudo) random integer.
     * <p>
     * This version has no bounds (aside from the integer range), so the returned number may be negative or zero.
     *
     * @return Randomly generated integer
     * @see #randomInt(int)
     */
    public static int randomInt() {
        return random.nextInt();
    }

    /**
     * Generates a (pseudo)random index of an element in the collection.
     * <p>
     * I.e. the returned number is in the interval <0, col.size()).
     *
     * @param col The collection
     * @return Random index
     */
    public static int randomIndex(Collection<?> col) {
        assert col != null;
        assert !col.isEmpty();
        return random.nextInt(col.size());
    }

    /**
     * Generators a (pseudo) random boolean.
     *
     * @return Random boolean
     */
    public static boolean randomBoolean() {
        return random.nextBoolean();
    }

    /**
     * Gets a random factor type.
     *
     * @return FactorType URI as String
     */
    public static URI randomFactorType() {
        return FACTOR_TYPES[random.nextInt(FACTOR_TYPES.length)];
    }

    /**
     * Generates a tree of questions with answers.
     *
     * @param maxDepth Maximum depth. Optional parameter. If not set, a random number (less than 10) will be generated
     * @return Root question
     */
    public static Question generateQuestions(Integer maxDepth) {
        final int max = maxDepth != null ? maxDepth : Generator.randomInt(10);
        final Question root = question();
        root.setUri(generateUri());
        root.setAnswers(Collections.singleton(answer()));
        generateQuestions(root, 0, max);
        return root;
    }

    public static Question question() {
        final Question q = new Question();
        q.setUri(generateUri());
        q.getTypes().add(Generator.generateEventType().toString());
        return q;
    }

    public static Answer answer() {
        final Answer a = new Answer();
        if (Generator.randomBoolean()) {
            a.setTextValue("RandomTextValue" + Generator.randomInt());
        } else {
            a.setCodeValue(Generator.generateUri());
        }
        return a;
    }

    private static void generateQuestions(Question parent, int depth, int maxDepth) {
        if (depth >= maxDepth) {
            return;
        }
        for (int i = 0; i < Generator.randomInt(5); i++) {
            final Question child = question();
            child.setAnswers(Collections.singleton(answer()));
            parent.getSubQuestions().add(child);
            generateQuestions(child, depth + 1, maxDepth);
        }
    }

    public static Set<CorrectiveMeasureRequest> generateCorrectiveMeasureRequests() {
        final Set<CorrectiveMeasureRequest> set = new HashSet<>();
        for (int i = 0; i < randomInt(5, 10); i++) {
            final CorrectiveMeasureRequest cmr = new CorrectiveMeasureRequest();
            cmr.setDescription(UUID.randomUUID().toString());
            if (Generator.randomBoolean()) {
                cmr.setResponsibleOrganizations(Collections.singleton(Generator.generateOrganization()));
            }
            set.add(cmr);
        }
        return set;
    }
}
