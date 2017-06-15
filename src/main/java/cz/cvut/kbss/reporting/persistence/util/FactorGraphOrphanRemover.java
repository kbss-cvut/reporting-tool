package cz.cvut.kbss.reporting.persistence.util;

import cz.cvut.kbss.jopa.model.EntityManager;
import cz.cvut.kbss.reporting.factorgraph.FactorGraphItem;
import cz.cvut.kbss.reporting.model.Event;
import cz.cvut.kbss.reporting.model.Factor;

import java.net.URI;
import java.util.*;
import java.util.stream.Collectors;

public class FactorGraphOrphanRemover {

    private final EntityManager em;
    private final Set<FactorGraphItem> visited = new HashSet<>();

    public FactorGraphOrphanRemover(EntityManager em) {
        this.em = Objects.requireNonNull(em);
    }

    public void removeOrphans(FactorGraphItem original, FactorGraphItem update) {
        removeOrphansImpl(original, update);
    }

    private void removeOrphansImpl(Set<Event> original, Set<Event> actual) {
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
            removeOrphansImpl(e, actualUris.get(e.getUri()));
        }
    }

    private void removeOrphansImpl(FactorGraphItem original, FactorGraphItem update) {
        if (visited.contains(original)) {
            return;
        }
        visited.add(original);
        if (original.getChildren() != null) {
            removeOrphansImpl(original.getChildren(), update.getChildren());
        }
        removeOrphansFromFactors(original.getFactors(), update.getFactors());
    }

    private void removeOrphansFromFactors(Set<Factor> original, Set<Factor> update) {
        if (original != null) {
            for (Factor of : original) {
                final Optional<Factor> af = update == null ? Optional.empty() :
                                            update.stream()
                                                  .filter(f -> f.getUri() != null && f.getUri().equals(of.getUri()))
                                                  .findFirst();
                af.ifPresent(factor -> removeOrphansImpl(of.getEvent(), factor.getEvent()));
            }
        }
    }
}
