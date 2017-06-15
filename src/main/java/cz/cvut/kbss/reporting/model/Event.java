package cz.cvut.kbss.reporting.model;

import cz.cvut.kbss.jopa.model.annotations.OWLClass;
import cz.cvut.kbss.jopa.model.annotations.OWLDataProperty;
import cz.cvut.kbss.jopa.model.annotations.Transient;
import cz.cvut.kbss.reporting.factorgraph.FactorGraphNodeVisitor;

import java.io.Serializable;
import java.util.Objects;

@OWLClass(iri = Vocabulary.s_c_Event)
public class Event extends AbstractEvent implements Serializable, Comparable<Event> {

    @OWLDataProperty(iri = Vocabulary.s_p_child_index)
    private Integer index;

    @Transient
    private Integer referenceId;

    public Event() {
    }

    public Event(Event other) {
        super(other);
        this.index = other.index;
    }

    /**
     * Represents position at among other children of this Event's parent.
     * <p>
     * This index can be used to order Event's children.
     *
     * @return Integer specifying the position or {@code null}, if the index is not relevant here (e.g. this event has
     * no parent)
     */
    public Integer getIndex() {
        return index;
    }

    public void setIndex(Integer index) {
        this.index = index;
    }

    /**
     * Reference id which was used by the corresponding DTO instance (if it was used).
     * <p>
     * Can be useful for identification of this instance in case we cannot rely on URI (e.g. when it has not been
     * generated, yet).
     * <p>
     * Note that in most cases the return value will be {@code null}. This is a non-persistent field.
     *
     * @return Reference id, can be {@code null}
     */
    public Integer getReferenceId() {
        return referenceId;
    }

    public void setReferenceId(Integer referenceId) {
        this.referenceId = referenceId;
    }

    @Override
    public void accept(FactorGraphNodeVisitor visitor) {
        visitor.visit(this);
    }

    @Override
    public String toString() {
        return "Event{" + uri +
                ", types=" + types +
                '}';
    }

    @Override
    public int compareTo(Event o) {
        if (index != null && o.index != null) {
            final int res = index.compareTo(o.index);
            // Ensure that comparison respects identity
            if (res == 0 && !Objects.equals(uri, o.uri)) {
                return hashCode() - o.hashCode();
            }
            return res;
        }
        // If either index is missing, do not use it at all. It could break sorted set equals/hashCode contract
        return hashCode() - o.hashCode();
    }
}
