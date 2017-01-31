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

import cz.cvut.kbss.jopa.model.annotations.*;
import cz.cvut.kbss.reporting.model.qam.Question;
import cz.cvut.kbss.reporting.model.util.HasOwlKey;
import cz.cvut.kbss.reporting.model.util.factorgraph.FactorGraphItem;
import cz.cvut.kbss.reporting.model.util.factorgraph.FactorGraphNodeVisitor;
import cz.cvut.kbss.reporting.model.util.factorgraph.clone.EdgeCloningVisitor;
import cz.cvut.kbss.reporting.model.util.factorgraph.clone.NodeCloningVisitor;
import cz.cvut.kbss.reporting.model.util.factorgraph.traversal.DefaultFactorGraphTraverser;
import cz.cvut.kbss.reporting.model.util.factorgraph.traversal.FactorGraphTraverser;

import java.io.Serializable;
import java.net.URI;
import java.util.*;

@OWLClass(iri = Vocabulary.s_c_Occurrence)
public class Occurrence extends AbstractEntity implements HasOwlKey, FactorGraphItem, Serializable {

    @ParticipationConstraints(nonEmpty = true)
    @OWLDataProperty(iri = Vocabulary.s_p_has_key)
    private String key;

    @ParticipationConstraints(nonEmpty = true)
    @OWLAnnotationProperty(iri = Vocabulary.s_p_label)
    private String name;

    @ParticipationConstraints(nonEmpty = true)
    @OWLDataProperty(iri = Vocabulary.s_p_has_start_time)
    private Date startTime;

    @ParticipationConstraints(nonEmpty = true)
    @OWLDataProperty(iri = Vocabulary.s_p_has_end_time)
    private Date endTime;

    @ParticipationConstraints(nonEmpty = true)
    @OWLObjectProperty(iri = Vocabulary.s_p_has_event_type)
    private URI eventType;

    @OWLObjectProperty(iri = Vocabulary.s_p_has_factor, fetch = FetchType.EAGER, cascade = CascadeType.ALL)
    private Set<Factor> factors;

    @OWLObjectProperty(iri = Vocabulary.s_p_has_part, fetch = FetchType.EAGER, cascade = {CascadeType.MERGE,
            CascadeType.REMOVE})
    private Set<Event> children;

    @OWLObjectProperty(iri = Vocabulary.s_p_has_related_question, cascade = {CascadeType.MERGE,
            CascadeType.REMOVE}, fetch = FetchType.EAGER)
    private Question question;

    @Types
    private Set<String> types;

    @Transient
    private Integer referenceId;

    public Occurrence() {
        this.types = new HashSet<>();
        // Occurrence is a subclass of Event
        types.add(Vocabulary.s_c_Event);
    }

    public Occurrence(Occurrence other) {
        this.name = other.name;
        this.startTime = other.startTime;
        this.endTime = other.endTime;
        this.eventType = other.eventType;
        this.types = new HashSet<>(other.types);
        if (other.question != null) {
            this.question = new Question(other.question);
        }
    }

    @Override
    public String getKey() {
        return key;
    }

    @Override
    public void setKey(String key) {
        this.key = key;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
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

    public URI getEventType() {
        return eventType;
    }

    /**
     * Sets type of this occurrence.
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

    public Set<Factor> getFactors() {
        return factors;
    }

    public void setFactors(Set<Factor> factors) {
        this.factors = factors;
    }

    @Override
    public void addFactor(Factor factor) {
        Objects.requireNonNull(factor);
        if (factors == null) {
            this.factors = new HashSet<>();
        }
        factors.add(factor);
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
    public String toString() {
        return "Occurrence{" + name + " <" + uri + ">, types=" + types + '}';
    }

    @Override
    public void accept(FactorGraphNodeVisitor visitor) {
        visitor.visit(this);
    }

    public static Occurrence copyOf(Occurrence original) {
        final Map<URI, FactorGraphItem> instanceMap = new HashMap<>();
        final NodeCloningVisitor nodeVisitor = new NodeCloningVisitor(instanceMap);
        final FactorGraphTraverser traverser = new DefaultFactorGraphTraverser(nodeVisitor, null);
        traverser.traverse(original);
        final EdgeCloningVisitor edgeVisitor = new EdgeCloningVisitor(instanceMap);
        traverser.setFactorGraphEdgeVisitor(edgeVisitor);
        traverser.traverse(original);
        return (Occurrence) instanceMap.get(original.getUri());
    }
}
