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
