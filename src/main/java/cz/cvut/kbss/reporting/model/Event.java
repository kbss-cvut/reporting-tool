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

import cz.cvut.kbss.reporting.model.qam.Question;
import cz.cvut.kbss.reporting.model.util.factorgraph.FactorGraphItem;
import cz.cvut.kbss.reporting.model.util.factorgraph.FactorGraphNodeVisitor;
import cz.cvut.kbss.jopa.model.annotations.*;

import java.io.Serializable;
import java.net.URI;
import java.util.Date;
import java.util.HashSet;
import java.util.Objects;
import java.util.Set;

@OWLClass(iri = Vocabulary.s_c_Event)
public class Event extends AbstractEntity implements FactorGraphItem, Serializable, Comparable<Event> {

    @OWLObjectProperty(iri = Vocabulary.s_p_has_factor, fetch = FetchType.EAGER, cascade = CascadeType.ALL)
    private Set<Factor> factors;

    @OWLObjectProperty(iri = Vocabulary.s_p_has_part, fetch = FetchType.EAGER, cascade = {CascadeType.MERGE,
            CascadeType.REMOVE})
    private Set<Event> children;

    @ParticipationConstraints(nonEmpty = true)
    @OWLDataProperty(iri = Vocabulary.s_p_has_start_time)
    private Date startTime;

    @ParticipationConstraints(nonEmpty = true)
    @OWLDataProperty(iri = Vocabulary.s_p_has_end_time)
    private Date endTime;

    @OWLObjectProperty(iri = Vocabulary.s_p_has_event_type)
    private URI eventType;

    @OWLDataProperty(iri = Vocabulary.s_p_child_index)
    private Integer index;

    @OWLObjectProperty(iri = Vocabulary.s_p_has_related_question, cascade = {CascadeType.MERGE,
            CascadeType.REMOVE}, fetch = FetchType.EAGER)
    private Question question;

    @Types
    private Set<String> types;

    @Transient
    private Integer referenceId;

    public Event() {
    }

    public Event(Event other) {
        this.startTime = other.startTime;
        this.endTime = other.endTime;
        this.eventType = other.eventType;
        this.index = other.index;
        if (other.types != null) {
            this.types = new HashSet<>(other.types);
        }
        if (other.question != null) {
            this.question = new Question(other.question);
        }
    }

    public Set<Factor> getFactors() {
        return factors;
    }

    public void setFactors(Set<Factor> factors) {
        this.factors = factors;
    }

    @Override
    public void addFactor(Factor f) {
        Objects.requireNonNull(f);
        if (factors == null) {
            this.factors = new HashSet<>();
        }
        factors.add(f);
    }

    public Set<Event> getChildren() {
        return children;
    }

    public void setChildren(Set<Event> children) {
        this.children = children;
    }

    @Override
    public void addChild(Event child) {
        Objects.requireNonNull(child);
        if (children == null) {
            this.children = new HashSet<>();
        }
        children.add(child);
    }

    public URI getEventType() {
        return eventType;
    }

    /**
     * Sets type of this event.
     * <p>
     * Also adds the event type's URI to this instance's types.
     *
     * @param eventType The type to set
     * @see Vocabulary#s_p_has_event_type
     */
    public void setEventType(URI eventType) {
        this.eventType = eventType;
        if (eventType != null) {
            if (types == null) {
                this.types = new HashSet<>(4);
            }
            types.add(eventType.toString());
        }
    }

    public Date getStartTime() {
        return startTime;
    }

    public void setStartTime(Date startTime) {
        this.startTime = startTime;
    }

    public Date getEndTime() {
        return endTime;
    }

    public void setEndTime(Date endTime) {
        this.endTime = endTime;
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

    public Question getQuestion() {
        return question;
    }

    public void setQuestion(Question question) {
        this.question = question;
    }

    public Set<String> getTypes() {
        return types;
    }

    public void setTypes(Set<String> types) {
        this.types = types;
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
            return index.compareTo(o.index);
        }
        // If either index is missing, do not use it at all. It could break sorted set equals/hashCode contract
        return hashCode() - o.hashCode();
    }
}
