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
        if (o == null || getClass() != o.getClass()) return false;

        Resource resource = (Resource) o;

        return reference.equals(resource.reference) && (description != null ? description.equals(resource.description) :
                resource.description == null);
    }

    @Override
    public int hashCode() {
        int result = reference.hashCode();
        result = 31 * result + (description != null ? description.hashCode() : 0);
        return result;
    }

    @Override
    public String toString() {
        return "Resource{" +
                "reference='" + reference + '\'' +
                " (" + description + ")} ";
    }
}
