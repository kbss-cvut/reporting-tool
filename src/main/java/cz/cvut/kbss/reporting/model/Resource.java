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
package cz.cvut.kbss.reporting.model;

import cz.cvut.kbss.jopa.model.annotations.OWLClass;
import cz.cvut.kbss.jopa.model.annotations.OWLDataProperty;
import cz.cvut.kbss.jopa.model.annotations.ParticipationConstraints;

import java.util.Objects;

@OWLClass(iri = Vocabulary.s_c_Resource)
public class Resource extends AbstractEntity {

    @ParticipationConstraints(nonEmpty = true)
    @OWLDataProperty(iri = Vocabulary.s_p_has_id)
    private String reference;

    @OWLDataProperty(iri = Vocabulary.s_p_description)
    private String description;

    public Resource() {
    }

    public Resource(Resource other) {
        Objects.requireNonNull(other);
        this.reference = other.reference;
        this.description = other.description;
    }

    public String getReference() {
        return reference;
    }

    public void setReference(String reference) {
        this.reference = reference;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof Resource)) return false;

        Resource resource = (Resource) o;

        return reference != null ? reference.equals(resource.reference) : resource.reference == null;

    }

    @Override
    public int hashCode() {
        return reference != null ? reference.hashCode() : 0;
    }

    @Override
    public String toString() {
        return "Resource{" +
                "reference='" + reference + '\'' +
                " (" + description + ")} ";
    }
}
