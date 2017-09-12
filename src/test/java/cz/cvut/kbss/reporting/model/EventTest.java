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
import cz.cvut.kbss.reporting.environment.generator.OccurrenceReportGenerator;
import cz.cvut.kbss.reporting.model.qam.Question;
import org.junit.Test;

import java.net.URI;
import java.util.*;
import java.util.stream.Collectors;
import java.util.stream.IntStream;

import static org.junit.Assert.*;

public class EventTest {

    /**
     * @see Vocabulary#s_p_has_event_type
     */
    @Test
    public void setTypeAddsEventTypeUriToInstanceTypesAsWell() {
        final URI et = Generator.generateEventType();
        final Event evt = new Event();
        assertTrue(evt.getTypes() == null || evt.getTypes().isEmpty());
        evt.setEventType(et);
        assertTrue(evt.getTypes().contains(et.toString()));
    }

    @Test
    public void copyConstructorCreatesNewFormInstance() {
        final URI et = Generator.generateEventType();
        final Event evt = new Event();
        evt.setEventType(et);
        final Question q = new Question();
        q.setUri(Generator.generateEventType());
        evt.setQuestion(q);

        final Event copy = new Event(evt);
        assertNotNull(copy.getQuestion());
        assertNotSame(q, copy.getQuestion());
    }

    @Test
    public void comparisonOfTwoInstancesWithTheSameIndexButDifferentUrisReturnsNonZero() {
        final Event e1 = OccurrenceReportGenerator.generateEvent();
        e1.setUri(Generator.generateUri());
        final Event e2 = OccurrenceReportGenerator.generateEvent();
        e1.setIndex(0);
        e2.setIndex(0);
        assertNotEquals(0, e1.compareTo(e2));
    }

    @Test
    public void comparisonWorksCorrectlyForEventsWithoutUris() {
        final List<Event> events = IntStream.range(0, 10).mapToObj(i -> {
            final Event event = OccurrenceReportGenerator.generateEvent();
            event.setIndex(i);
            return event;
        }).collect(Collectors.toList());
        Collections.shuffle(events);
        final Set<Event> eventSet = new TreeSet<>(events);
        assertEquals(events.size(), eventSet.size());
        Event previous, current;
        final Iterator<Event> it = eventSet.iterator();
        previous = it.next();
        while (it.hasNext()) {
            current = it.next();
            assertTrue(previous.getIndex() < current.getIndex());
            assertTrue(previous.compareTo(current) < 0);
            previous = current;
        }
    }
}