package cz.cvut.kbss.reporting.service.visitor;

import cz.cvut.kbss.jopa.model.EntityManager;
import cz.cvut.kbss.jopa.model.EntityManagerFactory;
import cz.cvut.kbss.reporting.environment.generator.Generator;
import cz.cvut.kbss.reporting.environment.generator.OccurrenceReportGenerator;
import cz.cvut.kbss.reporting.model.Event;
import cz.cvut.kbss.reporting.model.Occurrence;
import cz.cvut.kbss.reporting.persistence.dao.OccurrenceDao;
import cz.cvut.kbss.reporting.service.BaseServiceTestRunner;
import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;

import java.net.URI;
import java.util.Date;
import java.util.Set;

import static org.junit.Assert.*;

public class EventTypeSynchronizerTest extends BaseServiceTestRunner {

    @Autowired
    private OccurrenceDao occurrenceDao;

    @Autowired
    private EventTypeSynchronizer synchronizer;

    @Autowired
    private EntityManagerFactory emf;

    @Test
    public void addsEventTypeForOccurrenceToItsTypesForNewOccurrence() {
        final Occurrence occurrence = OccurrenceReportGenerator.generateOccurrence();
        occurrence.getTypes().remove(occurrence.getEventType().toString());
        assertFalse(occurrence.getTypes().contains(occurrence.getEventType().toString()));
        occurrence.accept(synchronizer);
        assertTrue(occurrence.getTypes().contains(occurrence.getEventType().toString()));
    }

    @Test
    public void removesOriginalEventTypeWhenNewOneWasSetOnOccurrence() {
        final Occurrence occurrence = OccurrenceReportGenerator.generateOccurrence();
        occurrenceDao.persist(occurrence);
        final URI originalType = occurrence.getEventType();
        final URI newType = Generator.generateEventType();
        occurrence.setEventType(newType);
        occurrence.accept(synchronizer);
        assertEquals(newType, occurrence.getEventType());
        assertTrue(occurrence.getTypes().contains(newType.toString()));
        assertFalse(occurrence.getTypes().contains(originalType.toString()));
    }

    @Test
    public void leaveOtherTypesIntactWhenSynchronizingUpdatedTypesOnOccurrence() {
        final Occurrence occurrence = OccurrenceReportGenerator.generateOccurrence();
        occurrenceDao.persist(occurrence);
        final URI originalType = occurrence.getEventType();
        final Set<String> origTypes = occurrence.getTypes();
        origTypes.remove(originalType.toString());
        occurrence.setEventType(Generator.generateEventType());
        occurrence.accept(synchronizer);
        assertFalse(occurrence.getTypes().contains(originalType.toString()));
        assertTrue(occurrence.getTypes().containsAll(origTypes));
    }

    @Test
    public void addsEventTypeToTypesForNewEvent() {
        final Event event = new Event();
        event.setEventType(Generator.generateEventType());
        event.getTypes().remove(event.getEventType().toString());
        assertFalse(event.getTypes().contains(event.getEventType().toString()));
        event.accept(synchronizer);
        assertTrue(event.getTypes().contains(event.getEventType().toString()));
    }

    @Test
    public void removesOriginalEventTypeWhenNewOneIsSetOnEvent() {
        final Event event = new Event();
        event.setEventType(Generator.generateEventType());
        event.setStartTime(new Date());
        event.setEndTime(new Date());
        persistEvent(event);
        final URI originalType = event.getEventType();
        final URI newEventType = Generator.generateEventType();
        event.setEventType(newEventType);
        event.accept(synchronizer);
        assertEquals(newEventType, event.getEventType());
        assertFalse(event.getTypes().contains(originalType.toString()));
        assertTrue(event.getTypes().contains(newEventType.toString()));
    }

    private void persistEvent(Event event) {
        final EntityManager em = emf.createEntityManager();
        try {
            em.getTransaction().begin();
            em.persist(event);
            em.getTransaction().commit();
        } finally {
            em.close();
        }
    }

    @Test
    public void onlyAddsEventTypeToTypesWhenOriginalEventTypeIsNull() {
        final Event event = new Event();
        event.setStartTime(new Date());
        event.setEndTime(new Date());
        persistEvent(event);
        final URI newEventType = Generator.generateEventType();
        event.setEventType(newEventType);
        event.accept(synchronizer);
        assertEquals(newEventType, event.getEventType());
        assertTrue(event.getTypes().contains(newEventType.toString()));
    }

    @Test
    public void removesTypeFromTypesWhenSetToNull() {
        final Event event = new Event();
        event.setStartTime(new Date());
        event.setEndTime(new Date());
        event.setEventType(Generator.generateEventType());
        persistEvent(event);
        final URI originalType = event.getEventType();
        event.setEventType(null);
        event.accept(synchronizer);
        assertFalse(event.getTypes().contains(originalType.toString()));
    }

    @Test
    public void leaveOtherTypesIntactWhenSynchronizingUpdatedTypesOnEvent() {
        final Event event = new Event();
        event.setStartTime(new Date());
        event.setEndTime(new Date());
        event.setEventType(Generator.generateEventType());
        persistEvent(event);
        final URI originalType = event.getEventType();
        final Set<String> origTypes = event.getTypes();
        origTypes.remove(originalType.toString());
        event.setEventType(Generator.generateEventType());
        event.accept(synchronizer);
        assertFalse(event.getTypes().contains(originalType.toString()));
        assertTrue(event.getTypes().containsAll(origTypes));
    }
}
