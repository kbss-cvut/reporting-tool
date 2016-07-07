/**
 * Copyright (C) 2016 Czech Technical University in Prague
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

import cz.cvut.kbss.reporting.environment.util.Generator;
import cz.cvut.kbss.reporting.environment.util.TestUtils;
import cz.cvut.kbss.reporting.model.Event;
import cz.cvut.kbss.reporting.model.Factor;
import cz.cvut.kbss.reporting.model.Occurrence;
import cz.cvut.kbss.reporting.model.qam.Answer;
import cz.cvut.kbss.reporting.model.qam.Question;
import cz.cvut.kbss.reporting.persistence.BaseDaoTestRunner;
import cz.cvut.kbss.jopa.model.EntityManager;
import cz.cvut.kbss.jopa.model.EntityManagerFactory;
import org.junit.Assert;
import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;

import java.net.URI;
import java.util.Date;
import java.util.HashSet;
import java.util.Set;
import java.util.stream.Collectors;

import static org.junit.Assert.*;

public class OccurrenceDaoTest extends BaseDaoTestRunner {

    private static final int MAX_DEPTH = 5;

    @Autowired
    private OccurrenceDao dao;

    @Autowired
    private EntityManagerFactory emf;

    @Test
    public void persistPersistsAllEventsFromFactorGraph() {
        final Occurrence occurrence = Generator.generateOccurrence();
        final Set<Event> events = new HashSet<>();
        generateFactorGraph(occurrence, events, 0);
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

    private void generateFactorGraph(Occurrence occurrence, Set<Event> events, int depth) {
        for (int i = 0; i < Generator.randomInt(5); i++) {
            final Event evt = event(events);
            occurrence.addChild(evt);
            generateFactorGraph(evt, events, depth + 1);
        }
        for (int i = 0; i < Generator.randomInt(5); i++) {
            final Factor f = factor(events);
            occurrence.addFactor(f);
            generateFactorGraph(f.getEvent(), events, depth + 1);
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
        final Occurrence occurrence = Generator.generateOccurrence();
        occurrence.setQuestion(Generator.generateQuestions(null));
        dao.persist(occurrence);
        final EntityManager em = emf.createEntityManager();
        try {
            TestUtils.verifyQuestions(occurrence.getQuestion(), question -> {
                final Question res = em.find(Question.class, question.getUri());
                assertNotNull(res);
                Assert.assertEquals(question.getTypes().size(), res.getTypes().size());
                assertTrue(question.getTypes().containsAll(res.getTypes()));
                final Set<URI> childUris = question.getSubQuestions().stream().map(Question::getUri)
                                                   .collect(Collectors.toSet());
                Assert.assertEquals(question.getSubQuestions().size(), res.getSubQuestions().size());
                res.getSubQuestions().forEach(sq -> assertTrue(childUris.contains(sq.getUri())));
                Assert.assertEquals(question.getAnswers().size(), res.getAnswers().size());
                // Assuming only one answer, the string representation can be used for comparison
                Assert.assertEquals(question.getAnswers().iterator().next().toString(),
                        res.getAnswers().iterator().next().toString());
            });
        } finally {
            em.close();
        }
    }

    @Test
    public void persistReusesQuestionsWithTheSameUri() {
        final Occurrence occurrence = Generator.generateOccurrence();
        final Set<Event> children = new HashSet<>(2);
        occurrence.setChildren(children);
        event(children);
        final Event evt = children.iterator().next();
        evt.setQuestion(generateReusedQuestions());
        dao.persist(occurrence);
        final EntityManager em = emf.createEntityManager();
        try {
            TestUtils.verifyQuestions(evt.getQuestion(), q -> assertNotNull(em.find(Question.class, q.getUri())));
        } finally {
            em.close();
        }
    }

    private Question generateReusedQuestions() {
        final Question root = Generator.question();
        Question copy = null;
        for (int i = 0; i < 5; i++) {
            copy = Generator.question();
            root.getSubQuestions().add(copy);
        }
        // Copy the first one into the last one to simulate behaviour when multiple question instances (received from the UI)
        // may represent the same one
        final Question first = root.getSubQuestions().iterator().next();
        copy.setUri(first.getUri());
        copy.setTypes(first.getTypes());
        return root;
    }

    @Test
    public void removeDeletesAllQuestionsAndAnswersAsWell() {
        final Occurrence occurrence = Generator.generateOccurrence();
        occurrence.setQuestion(Generator.generateQuestions(null));
        dao.persist(occurrence);

        dao.remove(occurrence);
        final EntityManager em = emf.createEntityManager();
        try {
            TestUtils.verifyQuestions(occurrence.getQuestion(), question -> {
                assertNull(em.find(Question.class, question.getUri()));
                question.getAnswers().forEach(a -> assertNull(em.find(Answer.class, a.getUri())));
            });
        } finally {
            em.close();
        }
    }
}