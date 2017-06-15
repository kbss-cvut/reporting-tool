package cz.cvut.kbss.reporting.model.textanalysis;

import cz.cvut.kbss.jopa.model.annotations.*;
import cz.cvut.kbss.reporting.model.AbstractEntity;
import cz.cvut.kbss.reporting.model.Vocabulary;

import java.net.URI;
import java.util.Set;

/**
 * Item extracted from some description by the text analysis service.
 */
@OWLClass(iri = Vocabulary.s_c_extracted_item)
public class ExtractedItem extends AbstractEntity {

    @OWLDataProperty(iri = Vocabulary.s_p_confidence_level)
    private Double confidence;

    @OWLAnnotationProperty(iri = Vocabulary.s_p_label)
    private String label;

    @OWLObjectProperty(iri = Vocabulary.s_p_references)
    private URI resource;

    @Types
    private Set<String> types;

    public ExtractedItem() {
    }

    public ExtractedItem(Double confidence, String label, URI resource) {
        this.confidence = confidence;
        this.label = label;
        this.resource = resource;
    }

    public Double getConfidence() {
        return confidence;
    }

    public void setConfidence(Double confidence) {
        this.confidence = confidence;
    }

    public String getLabel() {
        return label;
    }

    public void setLabel(String label) {
        this.label = label;
    }

    public URI getResource() {
        return resource;
    }

    public void setResource(URI resource) {
        this.resource = resource;
    }

    public Set<String> getTypes() {
        return types;
    }

    public void setTypes(Set<String> types) {
        this.types = types;
    }

    @Override
    public String toString() {
        return "ExtractedItem{" +
                "confidence=" + confidence +
                ", " + label +
                " -> " + resource +
                ", types=" + types +
                "}";
    }
}
