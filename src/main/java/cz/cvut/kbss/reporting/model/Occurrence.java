package cz.cvut.kbss.reporting.model;

import cz.cvut.kbss.jopa.model.annotations.*;
import cz.cvut.kbss.reporting.factorgraph.FactorGraphItem;
import cz.cvut.kbss.reporting.factorgraph.FactorGraphNodeVisitor;
import cz.cvut.kbss.reporting.factorgraph.clone.EdgeCloningVisitor;
import cz.cvut.kbss.reporting.factorgraph.clone.NodeCloningVisitor;
import cz.cvut.kbss.reporting.factorgraph.traversal.DefaultFactorGraphTraverser;
import cz.cvut.kbss.reporting.factorgraph.traversal.FactorGraphTraverser;
import cz.cvut.kbss.reporting.model.util.HasOwlKey;

import java.io.Serializable;
import java.net.URI;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Map;

@OWLClass(iri = Vocabulary.s_c_Occurrence)
public class Occurrence extends AbstractEvent implements HasOwlKey, Serializable {

    @ParticipationConstraints(nonEmpty = true)
    @OWLDataProperty(iri = Vocabulary.s_p_has_key)
    private String key;

    @ParticipationConstraints(nonEmpty = true)
    @OWLAnnotationProperty(iri = Vocabulary.s_p_label)
    private String name;

    @Transient
    private Integer referenceId;

    public Occurrence() {
        this.types = new HashSet<>();
        // Occurrence is a subclass of Event
        types.add(Vocabulary.s_c_Event);
    }

    public Occurrence(Occurrence other) {
        super(other);
        this.name = other.name;
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
