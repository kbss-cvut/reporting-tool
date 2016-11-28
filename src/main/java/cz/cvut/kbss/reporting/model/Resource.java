package cz.cvut.kbss.reporting.model;

import cz.cvut.kbss.jopa.model.annotations.OWLClass;
import cz.cvut.kbss.jopa.model.annotations.OWLDataProperty;
import cz.cvut.kbss.jopa.model.annotations.ParticipationConstraints;

import java.util.Objects;

@OWLClass(iri = Vocabulary.s_c_Resource)
public class Resource extends AbstractEntity {

    @ParticipationConstraints(nonEmpty = true)
    @OWLDataProperty(iri = Vocabulary.s_p_has_id)   // TODO What property should we use for this?
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
