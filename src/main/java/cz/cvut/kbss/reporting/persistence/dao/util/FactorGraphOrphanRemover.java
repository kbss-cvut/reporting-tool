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
package cz.cvut.kbss.reporting.persistence.dao.util;

import cz.cvut.kbss.jopa.model.EntityManager;
import cz.cvut.kbss.reporting.model.Event;
import cz.cvut.kbss.reporting.model.Factor;
import cz.cvut.kbss.reporting.model.util.factorgraph.FactorGraphItem;

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
                if (af.isPresent()) {
                    removeOrphansImpl(of.getEvent(), af.get().getEvent());
                }
            }
        }
    }
}
