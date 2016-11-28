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
