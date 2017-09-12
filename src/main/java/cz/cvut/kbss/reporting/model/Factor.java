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

import cz.cvut.kbss.jopa.model.annotations.*;

import java.io.Serializable;
import java.net.URI;
import java.util.HashSet;
import java.util.Objects;
import java.util.Set;

@OWLClass(iri = Vocabulary.s_c_factor)
public class Factor extends AbstractEntity implements Serializable {

    @ParticipationConstraints(nonEmpty = true)
    @OWLObjectProperty(iri = Vocabulary.s_p_has_factor, fetch = FetchType.EAGER)
    private Event event;

    @ParticipationConstraints(nonEmpty = true)
    @Types
    private Set<URI> types;

    public Event getEvent() {
        return event;
    }

    public void setEvent(Event event) {
        this.event = event;
    }

    public Set<URI> getTypes() {
        return types;
    }

    public void setTypes(Set<URI> types) {
        this.types = types;
    }

    public void addType(URI type) {
        Objects.requireNonNull(type);
        if (types == null) {
            this.types = new HashSet<>();
        }
        getTypes().add(type);
    }

    @Override
    public String toString() {
        return event + types.toString();
    }
}
