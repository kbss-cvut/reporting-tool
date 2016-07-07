package cz.cvut.kbss.reporting.environment.util;

import cz.cvut.kbss.reporting.model.qam.Answer;
import cz.cvut.kbss.reporting.model.qam.Question;
import cz.cvut.kbss.reporting.model.util.factorgraph.FactorGraphItem;
import cz.cvut.kbss.reporting.model.*;

import java.net.URI;
import java.util.*;

public class Generator {

    public static final String USERNAME = "halsey@unsc.org";
    public static final String PASSWORD = "john117";

    public static final URI BARRIER_EFFECTIVE = URI
            .create("http://onto.fel.cvut.cz/ontologies/arms/sira/barrier-effectiveness/effective");
    public static final URI BARRIER_LIMITED = URI
            .create("http://onto.fel.cvut.cz/ontologies/arms/sira/barrier-effectiveness/limited");
    public static final URI BARRIER_MINIMAL = URI
            .create("http://onto.fel.cvut.cz/ontologies/arms/sira/barrier-effectiveness/minimal");
    public static final URI BARRIER_NOT_EFFECTIVE = URI
            .create("http://onto.fel.cvut.cz/ontologies/arms/sira/barrier-effectiveness/not-effective");
    public static final URI ACCIDENT_NEGLIGIBLE = URI
            .create("http://onto.fel.cvut.cz/ontologies/arms/sira/accident-outcome/negligible");
    public static final URI ACCIDENT_MINOR = URI
            .create("http://onto.fel.cvut.cz/ontologies/arms/sira/accident-outcome/minor");
    public static final URI ACCIDENT_MAJOR = URI
            .create("http://onto.fel.cvut.cz/ontologies/arms/sira/accident-outcome/major");
    public static final URI ACCIDENT_CATASTROPHIC = URI
            .create("http://onto.fel.cvut.cz/ontologies/arms/sira/accident-outcome/catastrophic");

    public static final URI[] FACTOR_TYPES = {
            URI.create("http://onto.fel.cvut.cz/ontologies/aviation-safety/causes"),
            URI.create("http://onto.fel.cvut.cz/ontologies/aviation-safety/mitigates"),
            URI.create("http://onto.fel.cvut.cz/ontologies/aviation-safety/contributes_to")
    };

    private static Random random = new Random();

    private Generator() {
        throw new AssertionError();
    }

    public static Occurrence generateOccurrence() {
        final Occurrence occurrence = new Occurrence();
        occurrence.setName(UUID.randomUUID().toString());
        occurrence.setEventType(generateEventType());
        occurrence.setStartTime(new Date(System.currentTimeMillis() - 100000));
        occurrence.setEndTime(new Date());
        return occurrence;
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
        return org;
    }

    /**
     * Generates occurrence report.
     * <p>
     * Revision is set to 1, {@link #getPerson()} is used as author.
     *
     * @param setAttributes Whether to set attributes which should be normally set by a service, e.g. author.
     * @return OccurrenceReport
     */
    public static OccurrenceReport generateOccurrenceReport(boolean setAttributes) {
        final OccurrenceReport report = new OccurrenceReport();
        report.setOccurrence(generateOccurrence());
        report.setSummary("Some random summary " + randomInt() + ".");
        if (setAttributes) {
            report.setSeverityAssessment(
                    URI.create("http://onto.fel.cvut.cz/ontologies/eccairs/aviation-3.4.0.2/vl-a-431/v-100"));
            report.setAuthor(getPerson());
            report.setDateCreated(new Date());
            report.setFileNumber((long) randomInt(Integer.MAX_VALUE));
            report.setRevision(1);
        }
        return report;
    }

    public static OccurrenceReport generateOccurrenceReportWithFactorGraph() {
        final OccurrenceReport report = generateOccurrenceReport(true);
        final Event childOne = new Event();
        childOne.setStartTime(report.getOccurrence().getStartTime());
        childOne.setEndTime(report.getOccurrence().getEndTime());
        childOne.setEventType(generateEventType());
        report.getOccurrence().addChild(childOne);
        final Event childOneOne = new Event();
        childOneOne.setStartTime(report.getOccurrence().getStartTime());
        childOneOne.setEndTime(report.getOccurrence().getEndTime());
        childOneOne.setEventType(generateEventType());
        childOne.addChild(childOneOne);
        final Event fOne = new Event();
        fOne.setStartTime(report.getOccurrence().getStartTime());
        fOne.setEndTime(report.getOccurrence().getEndTime());
        fOne.setEventType(generateEventType());
        final Factor f = new Factor();
        f.addType(randomFactorType());
        f.setEvent(fOne);
        report.getOccurrence().addFactor(f);
        final Event fOneChildOne = new Event();
        fOneChildOne.setStartTime(report.getOccurrence().getStartTime());
        fOneChildOne.setEndTime(report.getOccurrence().getEndTime());
        fOneChildOne.setEventType(generateEventType());
        fOne.addChild(fOneChildOne);
        return report;
    }

    /**
     * Generates chain of OccurrenceReport instances with the same file number.
     *
     * @param author Report author, for all reports
     * @return The generated chain
     */
    public static List<OccurrenceReport> generateOccurrenceReportChain(Person author) {
        final OccurrenceReport first = Generator.generateOccurrenceReport(true);
        first.setAuthor(author);
        final List<OccurrenceReport> reports = new ArrayList<>();
        reports.add(first);
        OccurrenceReport previous = first;
        for (int i = 0; i < Generator.randomInt(10); i++) {
            final OccurrenceReport newRev = new OccurrenceReport(previous);
            newRev.setAuthor(author);
            newRev.setRevision(previous.getRevision() + 1);
            newRev.setDateCreated(new Date());
            reports.add(newRev);
            previous = newRev;
        }
        return reports;
    }

    public static Set<CorrectiveMeasureRequest> generateCorrectiveMeasureRequests() {
        final Set<CorrectiveMeasureRequest> set = new HashSet<>();
        for (int i = 0; i < randomInt(10); i++) {
            final CorrectiveMeasureRequest cmr = new CorrectiveMeasureRequest();
            cmr.setDescription(UUID.randomUUID().toString());
            int j = randomInt(Integer.MAX_VALUE);
            switch (j % 3) {
                case 0:
                    cmr.setResponsiblePersons(Collections.singleton(getPerson()));
                    final Event evt = new Event();
                    evt.setEventType(generateEventType());
                    cmr.setBasedOnEvent(evt);
                    break;
                case 1:
                    cmr.setResponsibleOrganizations(Collections.singleton(generateOrganization()));
                    cmr.setBasedOnOccurrence(generateOccurrence());
                    break;
                case 2:
                    cmr.setResponsiblePersons(Collections.singleton(getPerson()));
                    cmr.setResponsibleOrganizations(Collections.singleton(generateOrganization()));
                    break;
            }
            set.add(cmr);
        }
        return set;
    }

    public static Occurrence generateOccurrenceWithDescendantEvents() {
        final Occurrence occurrence = generateOccurrence();
        occurrence.setUri(URI.create("http://rootOccurrence"));
        final int maxDepth = randomInt(5);
        final int childCount = randomInt(5);
        generateChildEvents(occurrence, 0, maxDepth, childCount);
        return occurrence;
    }

    private static void generateChildEvents(FactorGraphItem parent, int depth, int maxDepth, int childCount) {
        if (depth >= maxDepth) {
            return;
        }
        parent.setChildren(new LinkedHashSet<>());
        for (int i = 0; i < childCount; i++) {
            final Event child = new Event();
            child.setStartTime(new Date());
            child.setEndTime(new Date());
            child.setUri(URI.create(Vocabulary.s_c_Event + "-instance" + randomInt()));
            child.setEventType(generateEventType());
            child.setIndex(i);
            parent.getChildren().add(child);
            generateChildEvents(child, depth + 1, maxDepth, childCount);
        }
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
     * @param maxDepth Maximum depth. Optional parameter. If not set, a random number will be generated
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
}
