package cz.cvut.kbss.reporting.model;

import cz.cvut.kbss.jopa.model.annotations.*;
import cz.cvut.kbss.reporting.factorgraph.FactorGraphItem;
import cz.cvut.kbss.reporting.model.qam.Question;

import java.net.URI;
import java.util.Date;
import java.util.HashSet;
import java.util.Objects;
import java.util.Set;

/**
 * Abstract representation of an event.
 */
@MappedSuperclass
public abstract class AbstractEvent extends AbstractEntity implements FactorGraphItem {

    @ParticipationConstraints(nonEmpty = true)
    @OWLDataProperty(iri = Vocabulary.s_p_has_start_time)
    protected Date startTime;

    @ParticipationConstraints(nonEmpty = true)
    @OWLDataProperty(iri = Vocabulary.s_p_has_end_time)
    protected Date endTime;

    @OWLObjectProperty(iri = Vocabulary.s_p_has_event_type)
    protected URI eventType;

    @OWLObjectProperty(iri = Vocabulary.s_p_has_factor, fetch = FetchType.EAGER, cascade = CascadeType.ALL)
    protected Set<Factor> factors;

    @OWLObjectProperty(iri = Vocabulary.s_p_has_part, fetch = FetchType.EAGER, cascade = {CascadeType.MERGE,
            CascadeType.REMOVE})
    protected Set<Event> children;

    @OWLObjectProperty(iri = Vocabulary.s_p_has_related_question, cascade = {CascadeType.MERGE,
            CascadeType.REMOVE}, fetch = FetchType.EAGER)
    protected Question question;

    @Types
    protected Set<String> types;

    AbstractEvent() {
    }

    AbstractEvent(AbstractEvent other) {
        this.startTime = other.startTime;
        this.endTime = other.endTime;
        this.eventType = other.eventType;
        this.types = other.types != null ? new HashSet<>(other.types) : new HashSet<>();
        if (other.question != null) {
            this.question = new Question(other.question);
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

    public URI getEventType() {
        return eventType;
    }

    public void setEventType(URI eventType) {
        this.eventType = eventType;
        syncEventTypeWithTypes();
    }

    /**
     * Synchronizes event type of this occurrence with its types.
     * <p>
     * Basically adds the event type to types.
     */
    public void syncEventTypeWithTypes() {
        if (eventType != null) {
            if (types == null) {
                this.types = new HashSet<>(4);
            }
            types.add(eventType.toString());
        }
    }

    @Override
    public Set<Factor> getFactors() {
        return factors;
    }

    @Override
    public void setFactors(Set<Factor> factors) {
        this.factors = factors;
    }

    @Override
    public Set<Event> getChildren() {
        return children;
    }

    @Override
    public void setChildren(Set<Event> children) {
        this.children = children;
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

    @Override
    public void addChild(Event child) {
        Objects.requireNonNull(child);
        if (children == null) {
            this.children = new HashSet<>();
        }
        children.add(child);
    }

    @Override
    public void addFactor(Factor factor) {
        Objects.requireNonNull(factor);
        if (factors == null) {
            this.factors = new HashSet<>();
        }
        factors.add(factor);
    }
}
