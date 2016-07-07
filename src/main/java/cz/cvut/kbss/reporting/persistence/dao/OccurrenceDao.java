package cz.cvut.kbss.reporting.persistence.dao;

import cz.cvut.kbss.reporting.model.Event;
import cz.cvut.kbss.reporting.model.Factor;
import cz.cvut.kbss.reporting.model.Occurrence;
import cz.cvut.kbss.reporting.persistence.dao.util.QuestionSaver;
import cz.cvut.kbss.reporting.util.IdentificationUtils;
import cz.cvut.kbss.jopa.model.EntityManager;
import org.springframework.stereotype.Repository;

import java.net.URI;
import java.util.*;
import java.util.stream.Collectors;

@Repository
public class OccurrenceDao extends OwlKeySupportingDao<Occurrence> {

    private QuestionSaver questionSaver;

    public OccurrenceDao() {
        super(Occurrence.class);
    }

    @Override
    protected void persist(Occurrence entity, final EntityManager em) {
        assert entity != null;
        entity.setKey(IdentificationUtils.generateKey());
        persistEventsIfNecessary(entity, em);
        em.persist(entity);
    }

    private void persistEventsIfNecessary(Occurrence entity, EntityManager em) {
        final Map<Event, Object> visited = new IdentityHashMap<>();
        this.questionSaver = new QuestionSaver();
        if (entity.getQuestion() != null) {
            questionSaver.persistIfNecessary(entity.getQuestion(), em);
        }
        if (entity.getChildren() != null) {
            entity.getChildren().forEach(e -> persistEventIfNecessary(e, em, visited));
        }
        if (entity.getFactors() != null) {
            entity.getFactors().forEach(f -> persistEventIfNecessary(f.getEvent(), em, visited));
        }
    }

    private void persistEventIfNecessary(Event event, final EntityManager em, Map<Event, Object> visited) {
        if (visited.containsKey(event)) {
            return;
        }
        visited.put(event, null);
        if (event.getChildren() != null) {
            event.getChildren().forEach(e -> persistEventIfNecessary(e, em, visited));
        }
        if (event.getFactors() != null) {
            event.getFactors().forEach(f -> persistEventIfNecessary(f.getEvent(), em, visited));
        }
        if (event.getUri() == null) {
            em.persist(event);
            if (event.getQuestion() != null) {
                questionSaver.persistIfNecessary(event.getQuestion(), em);
            }
        }
    }

    @Override
    protected void update(Occurrence entity, EntityManager em) {
        final Occurrence original = em.find(Occurrence.class, entity.getUri());
        removeOrphans(original, entity, em);
        persistEventsIfNecessary(entity, em);
        em.merge(entity);
    }

    private void removeOrphans(Occurrence original, Occurrence update, EntityManager em) {
        final Set<Event> visited = new HashSet<>();
        removeOrphans(original.getChildren(), update.getChildren(), em, visited);
        removeOrphansFromFactors(original.getFactors(), update.getFactors(), em, visited);
    }

    private void removeOrphans(Set<Event> original, Set<Event> actual, EntityManager em, Set<Event> visited) {
        if (original == null || original.isEmpty()) {
            return;
        }
        final Map<URI, Event> actualUris = new HashMap<>();
        if (actual != null) {
            actual.forEach(e -> actualUris.put(e.getUri(), e));
        }
        final Set<Event> toRemove = original.stream().filter(e -> !actualUris.containsKey(e.getUri()))
                                            .collect(Collectors.toSet());
        toRemove.forEach(em::remove);
        original.removeAll(toRemove);
        for (Event e : original) {
            removeOrphans(e, actualUris.get(e.getUri()), em, visited);
        }
    }

    private void removeOrphans(Event original, Event update, EntityManager em, Set<Event> visited) {
        if (visited.contains(original)) {
            return;
        }
        visited.add(original);
        if (original.getChildren() != null) {
            removeOrphans(original.getChildren(), update.getChildren(), em, visited);
        }
        removeOrphansFromFactors(original.getFactors(), update.getFactors(), em, visited);
    }

    private void removeOrphansFromFactors(Set<Factor> original, Set<Factor> update, EntityManager em,
                                          Set<Event> visited) {
        if (original != null) {
            for (Factor of : original) {
                final Optional<Factor> af = update == null ? Optional.empty() :
                                            update.stream()
                                                  .filter(f -> f.getUri() != null && f.getUri().equals(of.getUri()))
                                                  .findFirst();
                if (af.isPresent()) {
                    removeOrphans(of.getEvent(), af.get().getEvent(), em, visited);
                }
            }
        }
    }
}
