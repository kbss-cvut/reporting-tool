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
package cz.cvut.kbss.reporting.factorgraph;

import cz.cvut.kbss.reporting.environment.generator.Generator;
import cz.cvut.kbss.reporting.environment.generator.OccurrenceReportGenerator;
import cz.cvut.kbss.reporting.model.Event;
import cz.cvut.kbss.reporting.model.Occurrence;
import org.junit.Test;

import java.util.*;

import static org.junit.Assert.*;

public class EventChildIndexerTest {

    private final EventChildIndexer indexer = new EventChildIndexer();

    @Test
    public void ordersItemsAndSetsIndexesOnThemWhenIndexesAreMissing() {
        final Occurrence parent = OccurrenceReportGenerator.generateOccurrence();
        final Set<Event> events = generateEvents();
        parent.setChildren(events);
        indexer.visit(parent);
        events.forEach(e -> assertNotNull(e.getIndex()));
    }

    private Set<Event> generateEvents() {
        final Set<Event> events = new HashSet<>();
        for (int i = 0; i < Generator.randomInt(5, 10); i++) {
            events.add(OccurrenceReportGenerator.generateEvent());
        }
        return events;
    }

    @Test
    public void doesNothingWhenOccurrenceHasNoChildren() {
        final Occurrence parent = OccurrenceReportGenerator.generateOccurrence();
        assertNull(parent.getChildren());
        indexer.visit(parent);
        assertNull(parent.getChildren());
    }

    @Test
    public void doesNothingWhenEventHasNoChildren() {
        final Event parent = OccurrenceReportGenerator.generateEvent();
        assertNull(parent.getChildren());
        indexer.visit(parent);
        assertNull(parent.getChildren());
    }

    @Test
    public void resetsIndexesWhenThereAreGapsInChildrenIndexSequence() {
        final Set<Event> events = generateEvents();
        events.forEach(e -> {
            e.setIndex(Generator.randomInt());
            e.setUri(Generator.generateUri());
        });
        final Occurrence parent = OccurrenceReportGenerator.generateOccurrence();
        parent.setChildren(events);
        indexer.visit(parent);
        final List<Event> sorted = new ArrayList<>(parent.getChildren());
        sorted.sort(Comparator.comparing(Event::getIndex));
        for (int i = 0; i < sorted.size(); i++) {
            assertEquals(i, (int) sorted.get(i).getIndex());
        }
    }
}
