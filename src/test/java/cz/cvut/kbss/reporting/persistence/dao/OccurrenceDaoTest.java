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
package cz.cvut.kbss.reporting.persistence.dao;

import cz.cvut.kbss.jopa.model.EntityManager;
import cz.cvut.kbss.jopa.model.EntityManagerFactory;
import cz.cvut.kbss.reporting.environment.generator.Generator;
import cz.cvut.kbss.reporting.environment.generator.OccurrenceReportGenerator;
import cz.cvut.kbss.reporting.environment.util.TestUtils;
import cz.cvut.kbss.reporting.model.Event;
import cz.cvut.kbss.reporting.model.Factor;
import cz.cvut.kbss.reporting.model.Occurrence;
import cz.cvut.kbss.reporting.model.Vocabulary;
import cz.cvut.kbss.reporting.model.qam.Question;
import cz.cvut.kbss.reporting.persistence.BaseDaoTestRunner;
import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;

import java.net.URI;
import java.util.*;
import java.util.stream.Collectors;
import java.util.stream.IntStream;

import static cz.cvut.kbss.reporting.environment.util.TestUtils.verifyAllInstancesRemoved;
import static org.junit.Assert.*;

public class OccurrenceDaoTest extends BaseDaoTestRunner {

    private static final int MAX_DEPTH = 5;

    @Autowired
    private OccurrenceDao dao;

    @Autowired
    private EntityManagerFactory emf;

    @Test
    public void persistPersistsAllEventsFromFactorGraph() {
        final Occurrence occurrence = OccurrenceReportGenerator.generateOccurrence();
        final Set<Event> events = new HashSet<>();
        generateFactorGraph(occurrence, events);
        dao.persist(occurrence);

        final Occurrence res = dao.find(occurrence.getUri());
        assertNotNull(res);
        assertEquals(occurrence.getKey(), res.getKey());
        final EntityManager em = emf.createEntityManager();
        try {
            for (Event e : events) {
                assertNotNull(em.find(Event.class, e.getUri()));
            }
        } finally {
            em.close();
        }
    }

    private void generateFactorGraph(Occurrence occurrence, Set<Event> events) {
        for (int i = 0; i < Generator.randomInt(2, 5); i++) {
            final Event evt = event(events);
            occurrence.addChild(evt);
            generateFactorGraph(evt, events, 1);
        }
        for (int i = 0; i < Generator.randomInt(5); i++) {
            final Factor f = factor(events);
            occurrence.addFactor(f);
            generateFactorGraph(f.getEvent(), events, 1);
        }
    }

    private Event event(Set<Event> events) {
        final Event evt = new Event();
        evt.setStartTime(new Date());
        evt.setEndTime(new Date());
        evt.setEventType(Generator.generateEventType());
        events.add(evt);
        return evt;
    }

    private Factor factor(Set<Event> events) {
        final Factor f = new Factor();
        f.setEvent(event(events));
        f.addType(Generator.randomFactorType());
        return f;
    }

    private void generateFactorGraph(Event event, Set<Event> events, int depth) {
        if (depth == MAX_DEPTH) {
            return;
        }
        for (int i = 0; i < Generator.randomInt(5); i++) {
            final Event evt = event(events);
            event.addChild(evt);
            generateFactorGraph(evt, events, depth + 1);
        }
        for (int i = 0; i < Generator.randomInt(5); i++) {
            final Factor f = factor(events);
            event.addFactor(f);
            generateFactorGraph(f.getEvent(), events, depth + 1);
        }
    }

    @Test
    public void persistPersistsQuestionsAndAnswersOfEvents() {
        final Occurrence occurrence = OccurrenceReportGenerator.generateOccurrence();
        occurrence.setQuestion(Generator.generateQuestions(null));
        dao.persist(occurrence);
        final EntityManager em = emf.createEntityManager();
        try {
            TestUtils.verifyQuestions(occurrence.getQuestion(), question -> {
                final Question res = em.find(Question.class, question.getUri());
                assertNotNull(res);
                assertEquals(question.getTypes(), res.getTypes());
                final Set<URI> childUris = question.getSubQuestions().stream().map(Question::getUri)
                                                   .collect(Collectors.toSet());
                assertEquals(question.getSubQuestions().size(), res.getSubQuestions().size());
                res.getSubQuestions().forEach(sq -> assertTrue(childUris.contains(sq.getUri())));
                assertEquals(question.getAnswers().size(), res.getAnswers().size());
                // Assuming only one answer, the string representation can be used for comparison
                assertEquals(question.getAnswers().iterator().next().toString(),
                        res.getAnswers().iterator().next().toString());
            });
        } finally {
            em.close();
        }
    }

    @Test
    public void updateRemovesOrphans() {
        final Occurrence occurrence = OccurrenceReportGenerator.generateOccurrence();
        final Set<Event> events = new HashSet<>();
        generateFactorGraph(occurrence, events);
        dao.persist(occurrence);
        final Set<Event> removed = new HashSet<>();
        final Iterator<Event> it = occurrence.getChildren().iterator();
        final Event currentRoot = it.next();
        it.remove();
        removeChildren(currentRoot, removed);
        dao.update(occurrence);

        final EntityManager em = emf.createEntityManager();
        try {
            removed.forEach(e -> assertNull(em.find(Event.class, e.getUri())));
        } finally {
            em.close();
        }
        final Occurrence result = dao.find(occurrence.getUri());
        assertEquals(occurrence.getChildren().size(), result.getChildren().size());
    }

    private void removeChildren(Event event, Set<Event> toRemove) {
        toRemove.add(event);
        if (event.getChildren() != null) {
            event.getChildren().forEach(e -> removeChildren(e, toRemove));
        }
    }

    @Test
    public void removeDeletesAllQuestionsAndAnswersAsWell() {
        final Occurrence occurrence = OccurrenceReportGenerator.generateOccurrence();
        occurrence.setQuestion(Generator.generateQuestions(null));
        dao.persist(occurrence);

        dao.remove(occurrence);
        verifyAllInstancesRemoved(emf, Vocabulary.s_c_question);
        verifyAllInstancesRemoved(emf, Vocabulary.s_c_answer);
    }

    @Test
    public void removeRemovesCompleteFactorGraph() {
        final Occurrence occurrence = OccurrenceReportGenerator.generateOccurrenceReportWithFactorGraph()
                                                               .getOccurrence();
        dao.persist(occurrence);

        dao.remove(occurrence);
        verifyAllInstancesRemoved(emf, Vocabulary.s_c_Occurrence);
        verifyAllInstancesRemoved(emf, Vocabulary.s_c_factor);
        verifyAllInstancesRemoved(emf, Vocabulary.s_c_Event);
    }


    @Test
    public void updateCorrectlyUpdatesEventsThatAreFactorsOfOccurrence() {
        final Occurrence occurrence = generateOccurrenceWithFactors();
        dao.persist(occurrence);

        final List<Factor> factors = new ArrayList<>(occurrence.getFactors());
        final Factor newFactor = new Factor();
        final Event eventAsFactor = factors.get(0).getEvent();
        newFactor.setEvent(eventAsFactor);
        final Event eventWithFactor = factors.get(1).getEvent();
        factors.get(1).getEvent().addFactor(newFactor);
        final URI newEventType = Generator.generateEventType();
        factors.get(1).getEvent().setEventType(newEventType);
        dao.update(occurrence);

        final Occurrence result = dao.find(occurrence.getUri());
        assertEquals(2, result.getFactors().size());
        final Optional<Factor> factorForEvent = result.getFactors().stream()
                                                      .filter(f -> f.getEvent().getUri()
                                                                    .equals(eventWithFactor.getUri())).findFirst();
        assertTrue(factorForEvent.isPresent());
        final Event eventWithFactorResult = factorForEvent.get().getEvent();
        assertEquals(newEventType, eventWithFactorResult.getEventType());
        assertEquals(1, eventWithFactorResult.getFactors().size());
        final Factor factor = eventWithFactorResult.getFactors().iterator().next();
        assertEquals(eventAsFactor.getUri(), factor.getEvent().getUri());
    }

    private Occurrence generateOccurrenceWithFactors() {
        final Occurrence occurrence = OccurrenceReportGenerator.generateOccurrence();
        final Factor f1 = new Factor();
        final Event e1 = OccurrenceReportGenerator.generateEvent();
        f1.setEvent(e1);
        f1.addType(Generator.randomFactorType());
        occurrence.addFactor(f1);
        e1.addChild(OccurrenceReportGenerator.generateEvent());
        final Factor f2 = new Factor();
        final Event e2 = OccurrenceReportGenerator.generateEvent();
        f2.setEvent(e2);
        f2.addType(Generator.randomFactorType());
        occurrence.addFactor(f2);
        return occurrence;
    }

    @Test
    public void updateRemovesOrphansAndPersistsNewEventsDepthOne() {
        final Occurrence occurrence = OccurrenceReportGenerator.generateOccurrence();
        final List<Event> children = IntStream.range(0, 4).mapToObj(i -> OccurrenceReportGenerator.generateEvent())
                                              .collect(Collectors.toList());
        occurrence.setChildren(new HashSet<>(children));
        generateFactorsBetweenEvents(children);
        dao.persist(occurrence);

        occurrence.getChildren().remove(children.get(0));
        children.get(1).getFactors().clear();
        occurrence.getChildren().remove(children.get(2));
        children.get(3).getFactors().clear();
        final Event newEvent = OccurrenceReportGenerator.generateEvent();
        occurrence.addChild(newEvent);
        final Factor f = new Factor();
        f.addType(URI.create(Vocabulary.s_c_mitigation));
        f.setEvent(newEvent);
        children.get(3).addFactor(f);
        dao.update(occurrence);

        emf.getCache().evictAll();
        final Occurrence result = dao.find(occurrence.getUri());
        assertEquals(occurrence.getChildren().size(), result.getChildren().size());
        final URI idOfEventWithFactor = children.get(3).getUri();
        final Optional<Event> eventWithFactor = result.getChildren().stream()
                                                      .filter(e -> e.getUri().equals(idOfEventWithFactor)).findAny();
        assertTrue(eventWithFactor.isPresent());
        final Event e = eventWithFactor.get();
        assertEquals(1, e.getFactors().size());
        assertTrue(result.getChildren().contains(e.getFactors().iterator().next().getEvent()));
    }

    /**
     * Every odd event is a factor of the next even event.
     */
    private void generateFactorsBetweenEvents(List<Event> events) {
        assert events.size() > 1;
        for (int i = 1; i < events.size(); i = i + 2) {
            final Factor factor = new Factor();
            factor.addType(URI.create(Vocabulary.s_c_cause));
            factor.setEvent(events.get(i - 1));
            events.get(i).addFactor(factor);
        }
    }

    @Test
    public void updatePersistsAddedEventsAndFactors() {
        final Occurrence occurrence = OccurrenceReportGenerator.generateOccurrence();
        final Event child = OccurrenceReportGenerator.generateEvent();
        occurrence.addChild(child);
        final Event grandChild = OccurrenceReportGenerator.generateEvent();
        child.addChild(grandChild);
        dao.persist(occurrence);

        final Event newChild = OccurrenceReportGenerator.generateEvent();
        occurrence.addChild(newChild);
        final Event newGrandChild = OccurrenceReportGenerator.generateEvent();
        newChild.addChild(newGrandChild);
        final Factor factor = new Factor();
        factor.setEvent(grandChild);
        newGrandChild.addFactor(factor);
        dao.update(occurrence);
        emf.getCache().evictAll();

        final Occurrence result = dao.find(occurrence.getUri());
        assertEquals(occurrence.getChildren().size(), result.getChildren().size());
        final Optional<Event> hasChildWithFactor = result.getChildren().stream()
                                                         .filter(e -> e.getUri().equals(newChild.getUri())).findAny();
        assertTrue(hasChildWithFactor.isPresent());
        final Event childWithFactor = hasChildWithFactor.get().getChildren().iterator().next();
        assertEquals(1, childWithFactor.getFactors().size());
    }
}