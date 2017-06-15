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
package cz.cvut.kbss.reporting.persistence.util;

import cz.cvut.kbss.jopa.model.EntityManager;
import cz.cvut.kbss.reporting.model.util.HasUri;

import java.net.URI;
import java.util.Collection;
import java.util.Collections;
import java.util.Objects;
import java.util.Set;
import java.util.stream.Collectors;

/**
 * Used to remove orphan instances.
 * <p>
 * I.e. instances, which were removed from collections in updated entities. This utility class resolves the issue of
 * missing {@code orphanRemoval} attribute support in JOPA.
 */
public class OrphanRemover {

    private final EntityManager em;

    public OrphanRemover(EntityManager em) {
        this.em = Objects.requireNonNull(em);
    }

    public <T extends HasUri> void removeOrphans(Collection<T> originals, Collection<T> updates) {
        final Set<URI> updateUris = updates == null ? Collections.emptySet() :
                                    updates.stream().map(HasUri::getUri).collect(Collectors.toSet());
        final Set<T> orphans = originals == null ? Collections.emptySet() :
                               originals.stream().filter(m -> !updateUris.contains(m.getUri()))
                                        .collect(Collectors.toSet());
        orphans.forEach(o -> {
            final T toRemove = em.merge(o);
            em.remove(toRemove);
        });
    }
}
