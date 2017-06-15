package cz.cvut.kbss.reporting.environment.generator;

import cz.cvut.kbss.reporting.factorgraph.FactorGraphItem;
import cz.cvut.kbss.reporting.model.*;

import java.net.URI;
import java.util.*;

public class OccurrenceReportGenerator {
    /**
     * Generates occurrence report.
     * <p>
     * Revision is set to 1, {@link Generator#getPerson()} is used as author.
     *
     * @param setAttributes Whether to set attributes which should be normally set by a service, e.g. author.
     * @return OccurrenceReport
     */
    public static OccurrenceReport generateOccurrenceReport(boolean setAttributes) {
        final OccurrenceReport report = new OccurrenceReport();
        report.setOccurrence(generateOccurrence());
        report.setSummary("Some random summary " + Generator.randomInt() + ".");
        if (setAttributes) {
            report.setSeverityAssessment(
                    URI.create("http://onto.fel.cvut.cz/ontologies/eccairs/aviation-3.4.0.2/vl-a-431/v-100"));
            report.setAuthor(Generator.getPerson());
            report.setDateCreated(new Date());
            report.setFileNumber((long) Generator.randomInt(Integer.MAX_VALUE));
            report.setRevision(1);
        }
        return report;
    }

    public static OccurrenceReport generateOccurrenceReportWithFactorGraph() {
        final OccurrenceReport report = generateOccurrenceReport(true);
        final Event childOne = new Event();
        childOne.setStartTime(report.getOccurrence().getStartTime());
        childOne.setEndTime(report.getOccurrence().getEndTime());
        childOne.setEventType(Generator.generateEventType());
        report.getOccurrence().addChild(childOne);
        final Event childOneOne = new Event();
        childOneOne.setStartTime(report.getOccurrence().getStartTime());
        childOneOne.setEndTime(report.getOccurrence().getEndTime());
        childOneOne.setEventType(Generator.generateEventType());
        childOne.addChild(childOneOne);
        final Event fOne = new Event();
        fOne.setStartTime(report.getOccurrence().getStartTime());
        fOne.setEndTime(report.getOccurrence().getEndTime());
        fOne.setEventType(Generator.generateEventType());
        final Factor f = new Factor();
        f.addType(Generator.randomFactorType());
        f.setEvent(fOne);
        report.getOccurrence().addFactor(f);
        final Event fOneChildOne = new Event();
        fOneChildOne.setStartTime(report.getOccurrence().getStartTime());
        fOneChildOne.setEndTime(report.getOccurrence().getEndTime());
        fOneChildOne.setEventType(Generator.generateEventType());
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
        final OccurrenceReport first = generateOccurrenceReport(true);
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

    public static Occurrence generateOccurrence() {
        final Occurrence occurrence = new Occurrence();
        occurrence.setName(UUID.randomUUID().toString());
        occurrence.setEventType(Generator.generateEventType());
        occurrence.setStartTime(new Date(System.currentTimeMillis() - 100000));
        occurrence.setEndTime(new Date());
        return occurrence;
    }

    public static Set<CorrectiveMeasureRequest> generateCorrectiveMeasureRequests() {
        final Set<CorrectiveMeasureRequest> set = new HashSet<>();
        for (int i = 0; i < Generator.randomInt(2, 10); i++) {
            final CorrectiveMeasureRequest cmr = new CorrectiveMeasureRequest();
            cmr.setDescription(UUID.randomUUID().toString());
            int j = Generator.randomInt(Integer.MAX_VALUE);
            switch (j % 3) {
                case 0:
                    cmr.setResponsiblePersons(Collections.singleton(Generator.getPerson()));
                    final Event evt = new Event();
                    evt.setEventType(Generator.generateEventType());
                    cmr.setBasedOnEvent(evt);
                    break;
                case 1:
                    cmr.setResponsibleOrganizations(Collections.singleton(Generator.generateOrganization()));
                    cmr.setBasedOnOccurrence(generateOccurrence());
                    break;
                case 2:
                    cmr.setResponsiblePersons(Collections.singleton(Generator.getPerson()));
                    cmr.setResponsibleOrganizations(Collections.singleton(Generator.generateOrganization()));
                    break;
            }
            set.add(cmr);
        }
        return set;
    }

    public static Occurrence generateOccurrenceWithDescendantEvents(boolean withUris) {
        final Occurrence occurrence = generateOccurrence();
        if (withUris) {
            occurrence.setUri(URI.create("http://rootOccurrence"));
        }
        final int maxDepth = Generator.randomInt(5);
        final int childCount = Generator.randomInt(5);
        generateChildEvents(occurrence, 0, maxDepth, childCount, withUris);
        return occurrence;
    }

    private static void generateChildEvents(FactorGraphItem parent, int depth, int maxDepth, int childCount,
                                            boolean withUris) {
        if (depth >= maxDepth) {
            return;
        }
        parent.setChildren(new LinkedHashSet<>());
        for (int i = 0; i < childCount; i++) {
            final Event child = generateEvent();
            if (withUris) {
                child.setUri(URI.create(Vocabulary.s_c_Event + "-instance" + Generator.randomInt()));
            }
            child.setIndex(i);
            parent.getChildren().add(child);
            generateChildEvents(child, depth + 1, maxDepth, childCount, withUris);
        }
    }

    public static Event generateEvent() {
        final Event child = new Event();
        child.setStartTime(new Date());
        child.setEndTime(new Date());
        child.setEventType(Generator.generateEventType());
        return child;
    }

    public static InitialReport generateInitialReport() {
        final InitialReport ir = new InitialReport();
        ir.setDescription("Random description of an initial report. Randomness: " + Generator.randomInt());
        return ir;
    }
}
