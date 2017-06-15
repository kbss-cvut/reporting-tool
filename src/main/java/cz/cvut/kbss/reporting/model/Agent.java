package cz.cvut.kbss.reporting.model;

import cz.cvut.kbss.jopa.model.annotations.Id;
import cz.cvut.kbss.jopa.model.annotations.OWLClass;
import cz.cvut.kbss.reporting.model.util.HasUri;

import java.io.Serializable;
import java.net.URI;

@OWLClass(iri = Vocabulary.s_c_Agent)
public class Agent implements HasUri, Serializable {

    @Id
    private URI uri;

    @Override
    public URI getUri() {
        return uri;
    }

    public void setUri(URI uri) {
        this.uri = uri;
    }
}
