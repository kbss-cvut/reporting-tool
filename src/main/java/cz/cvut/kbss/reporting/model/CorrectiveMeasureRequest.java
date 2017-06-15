package cz.cvut.kbss.reporting.model;

import cz.cvut.kbss.jopa.model.annotations.FetchType;
import cz.cvut.kbss.jopa.model.annotations.OWLClass;
import cz.cvut.kbss.jopa.model.annotations.OWLDataProperty;
import cz.cvut.kbss.jopa.model.annotations.OWLObjectProperty;

import java.io.Serializable;
import java.util.HashSet;
import java.util.Objects;
import java.util.Set;

import static cz.cvut.kbss.reporting.util.Constants.DESCRIPTION_TO_STRING_THRESHOLD;

/**
 * The responsiblePerson/Organization and basedOnEvent/Occurrence fields are here because of the lack of support for
 * inheritance in JOPA. This should be handled on DTO level, where these fields should be replaced with ones using
 * inheritance between agent - Person/Organization and Event - Occurrence.
 */
@OWLClass(iri = Vocabulary.s_c_corrective_measure_request)
public class CorrectiveMeasureRequest extends AbstractEntity implements Serializable {

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
                    (description.length() > DESCRIPTION_TO_STRING_THRESHOLD ?
                     description.substring(0, DESCRIPTION_TO_STRING_THRESHOLD) + "..." :
                     description) + '}';
        }
        return "CorrectiveMeasureRequest{" + uri + "}";
    }
}
