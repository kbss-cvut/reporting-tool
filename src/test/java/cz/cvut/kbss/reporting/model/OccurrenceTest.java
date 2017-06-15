package cz.cvut.kbss.reporting.model;

import cz.cvut.kbss.reporting.environment.generator.Generator;
import cz.cvut.kbss.reporting.environment.generator.OccurrenceReportGenerator;
import cz.cvut.kbss.reporting.model.qam.Question;
import org.junit.Test;

import java.net.URI;
import java.util.*;

import static org.junit.Assert.*;

public class OccurrenceTest {

    @Test
    public void newInstanceHasEventInTypes() {
        final Occurrence o = new Occurrence();
        assertTrue(o.getTypes().contains(Vocabulary.s_c_Event));
    }

    @Test
    public void copyOfCopiesOccurrenceWithChildren() {
        final Occurrence original = OccurrenceReportGenerator.generateOccurrenceWithDescendantEvents(true);
        final Occurrence result = Occurrence.copyOf(original);
        assertNotNull(result);
        verifyFactorGraph(original, result);
    }

    private void verifyFactorGraph(Occurrence original, Occurrence copy) {
        assertNotSame(original, copy);
        assertEquals(original.getName(), copy.getName());
        final Set<URI> visited = new HashSet<>();
        verifyChildren(original.getChildren(), copy.getChildren(), visited);
        verifyFactors(original.getFactors(), copy.getFactors(), visited);
    }

    private void verifyChildren(Set<Event> original, Set<Event> copy, Set<URI> visited) {
        if (original == null) {
            assertNull(copy);
            return;
        }
        assertNotNull(copy);
        final Set<Event> sortedCopy = new TreeSet<>();
        sortedCopy.addAll(copy);
        assertEquals(original.size(), sortedCopy.size());
        final Iterator<Event> itOrig = original.iterator();
        final Iterator<Event> itCopy = sortedCopy.iterator();
        while (itOrig.hasNext()) {
            final Event origEvent = itOrig.next();
            final Event copyEvent = itCopy.next();
            verifyEvents(origEvent, copyEvent, visited);
        }
    }

    private void verifyEvents(Event original, Event copy, Set<URI> visited) {
        if (visited.contains(original.getUri())) {
            return;
        }
        visited.add(original.getUri());
        assertNotSame(original, copy);
        assertEquals(original.getIndex(), copy.getIndex());
        assertEquals(original.getEventType(), copy.getEventType());
        assertEquals(original.getStartTime(), copy.getStartTime());
        verifyChildren(original.getChildren(), copy.getChildren(), visited);
        verifyFactors(original.getFactors(), copy.getFactors(), visited);
    }

    private void verifyFactors(Set<Factor> original, Set<Factor> copy, Set<URI> visited) {
        if (original == null) {
            assertNull(copy);
            return;
        }
        assertNotNull(copy);
        assertEquals(original.size(), copy.size());
        boolean found;
        for (Factor of : original) {
            found = false;
            for (Factor cf : copy) {
                if (of.getEvent().getEventType().equals(cf.getEvent().getEventType())) {
                    found = true;
                    assertEquals(of.getTypes(), cf.getTypes());
                    verifyEvents(of.getEvent(), cf.getEvent(), visited);
                    break;
                }
            }
            assertTrue(found);
        }
    }

    @Test
    public void copyOfCopiesFactorGraph() {
        final Occurrence original = generateFactorGraph();
        final Occurrence result = Occurrence.copyOf(original);
        assertNotNull(result);
        verifyFactorGraph(original, result);
    }

    private Occurrence generateFactorGraph() {
        final Occurrence o = OccurrenceReportGenerator.generateOccurrenceWithDescendantEvents(true);
        final Event e1 = event();
        final Factor f1 = new Factor();
        f1.setEvent(e1);
        f1.addType(Generator.randomFactorType());
        o.addFactor(f1);
        final Event e2 = event();
        e2.setIndex(0);
        e1.addChild(e2);
        final Event e3 = event();
        e3.setIndex(1);
        e1.addChild(e3);
        final Factor f2 = new Factor();
        f2.setEvent(e2);
        f2.addType(Generator.randomFactorType());
        e3.addFactor(f2);
        if (o.getChildren() != null && o.getChildren().size() > 2) {
            final List<Event> lst = new ArrayList<>(o.getChildren());
            final Event start = lst.get(Generator.randomIndex(lst));
            final Event end = lst.get(Generator.randomIndex(lst));
            if (start != end) {
                final Factor f3 = new Factor();
                f3.addType(Generator.randomFactorType());
                f3.setEvent(start);
                end.addFactor(f3);
            }
        }
        return o;
    }

    private Event event() {
        final Event e = new Event();
        e.setEventType(Generator.generateEventType());
        e.setStartTime(new Date());
        e.setEndTime(new Date());
        e.setUri(URI.create(Vocabulary.s_c_Event + "-instance" + Generator.randomInt()));
        return e;
    }

    @Test
    public void setEventTypeAddsEventTypeToTypesToo() {
        final Occurrence occurrence = OccurrenceReportGenerator.generateOccurrence();
        final URI eventType = Generator.generateEventType();
        occurrence.setEventType(eventType);
        assertTrue(occurrence.getTypes().contains(eventType.toString()));
    }

    @Test
    public void copyConstructorCopiesQuestionInstance() {
        final Occurrence occurrence = OccurrenceReportGenerator.generateOccurrence();
        final Question question = new Question();
        question.setUri(URI.create(Vocabulary.s_c_question + "instance117"));
        occurrence.setQuestion(question);

        final Occurrence copy = new Occurrence(occurrence);
        assertNotNull(copy.getQuestion());
        assertNotSame(question, copy.getQuestion());
    }
}