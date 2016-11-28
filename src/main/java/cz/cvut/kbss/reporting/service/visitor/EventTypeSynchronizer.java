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
package cz.cvut.kbss.reporting.service.visitor;

import cz.cvut.kbss.reporting.model.Event;
import cz.cvut.kbss.reporting.model.Occurrence;
import cz.cvut.kbss.reporting.model.util.factorgraph.FactorGraphNodeVisitor;
import cz.cvut.kbss.reporting.persistence.dao.EventDao;
import cz.cvut.kbss.reporting.persistence.dao.OccurrenceDao;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/**
 * Keeps event type and occurrence/event types in sync by adding or removing the event type to/from types.
 * <p>
 * For example when an occurrence is updated and its event type changes, the synchronizer removes the original event
 * type from types and adds the new one.
 */
@Service
public class EventTypeSynchronizer implements FactorGraphNodeVisitor {

    @Autowired
    private OccurrenceDao occurrenceDao;

    @Autowired
    private EventDao eventDao;

    @Override
    public void visit(Occurrence occurrence) {
        occurrence.setEventType(occurrence.getEventType());
        if (occurrence.getUri() != null) {
            final Occurrence original = occurrenceDao.find(occurrence.getUri());
            assert original != null;
            if (!original.getEventType().equals(occurrence.getEventType())) {
                occurrence.getTypes().remove(original.getEventType().toString());
            }
        }
    }

    @Override
    public void visit(Event event) {
        event.setEventType(event.getEventType());
        if (event.getUri() != null) {
            final Event original = eventDao.find(event.getUri());
            assert original != null;
            if (original.getEventType() != null && !original.getEventType().equals(event.getEventType())) {
                event.getTypes().remove(original.getEventType().toString());
            }
        }
    }
}
