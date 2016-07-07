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

import cz.cvut.kbss.reporting.model.util.HasUri;
import cz.cvut.kbss.jopa.model.annotations.*;

import java.io.Serializable;
import java.net.URI;
import java.util.HashSet;
import java.util.Objects;
import java.util.Set;

/**
 * The responsiblePerson/Organization and basedOnEvent/Occurrence fields are here because of the lack of support for
 * inheritance in JOPA. This should be handled on DTO level, where these fields should be replaced with ones using
 * inheritance between agent - Person/Organization and Event - Occurrence.
 */
@OWLClass(iri = Vocabulary.s_c_corrective_measure_request)
public class CorrectiveMeasureRequest implements HasUri, Serializable {

    @Id(generated = true)
    private URI uri;

    @OWLDataProperty(iri = Vocabulary.s_p_description)
    private String description;

    @OWLObjectProperty(iri = Vocabulary.s_p_has_responsible_person, fetch = FetchType.EAGER)
    private Set<Person> responsiblePersons;

    @OWLObjectProperty(iri = Vocabulary.s_p_has_responsible_organization, fetch = FetchType.EAGER)
    private Set<Organization> responsibleOrganizations;

    @OWLObjectProperty(iri = Vocabulary.s_p_based_on_event, fetch = FetchType.EAGER)
    private Event basedOnEvent;

    @OWLObjectProperty(iri = Vocabulary.s_p_based_on_occurrence, fetch = FetchType.EAGER)
    private Occurrence basedOnOccurrence;

    public CorrectiveMeasureRequest() {
    }

    /**
     * Copy constructor.
     * <p>
     * Responsible agents are reused.
     *
     * @param other The instance to copy
     */
    public CorrectiveMeasureRequest(CorrectiveMeasureRequest other) {
        Objects.requireNonNull(other);
        this.description = other.description;
        if (other.responsiblePersons != null) {
            this.responsiblePersons = new HashSet<>(other.responsiblePersons);
        }
        if (other.responsibleOrganizations != null) {
            this.responsibleOrganizations = new HashSet<>(other.responsibleOrganizations);
        }
        this.basedOnEvent = other.basedOnEvent;
        this.basedOnOccurrence = other.basedOnOccurrence;
    }

    @Override
    public URI getUri() {
        return uri;
    }

    public void setUri(URI uri) {
        this.uri = uri;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Event getBasedOnEvent() {
        return basedOnEvent;
    }

    public void setBasedOnEvent(Event basedOnEvent) {
        this.basedOnEvent = basedOnEvent;
    }

    public Occurrence getBasedOnOccurrence() {
        return basedOnOccurrence;
    }

    public void setBasedOnOccurrence(Occurrence basedOnOccurrence) {
        this.basedOnOccurrence = basedOnOccurrence;
    }

    public Set<Person> getResponsiblePersons() {
        return responsiblePersons;
    }

    public void setResponsiblePersons(Set<Person> responsiblePersons) {
        this.responsiblePersons = responsiblePersons;
    }

    public Set<Organization> getResponsibleOrganizations() {
        return responsibleOrganizations;
    }

    public void setResponsibleOrganizations(
            Set<Organization> responsibleOrganizations) {
        this.responsibleOrganizations = responsibleOrganizations;
    }

    @Override
    public String toString() {
        // First 50 characters of the description
        if (description != null) {
            return "CorrectiveMeasureRequest{" +
                    (description.length() > 50 ? description.substring(0, 50) + "..." : description) + '}';
        }
        return "CorrectiveMeasureRequest{" + uri + "}";
    }
}
