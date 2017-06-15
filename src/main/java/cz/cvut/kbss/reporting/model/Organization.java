package cz.cvut.kbss.reporting.model;

import cz.cvut.kbss.jopa.model.annotations.*;
import cz.cvut.kbss.reporting.model.util.HasDerivableUri;
import cz.cvut.kbss.reporting.util.Constants;

import java.io.Serializable;
import java.net.URI;
import java.util.HashSet;
import java.util.Set;

@OWLClass(iri = Vocabulary.s_c_Organization)
public class Organization implements HasDerivableUri, Serializable {

    @Id
    private URI uri;

    @ParticipationConstraints(nonEmpty = true)
    @OWLAnnotationProperty(iri = Vocabulary.s_p_label)
    private String name;

    @Types
    private Set<String> types;

    public Organization() {
        this.types = new HashSet<>(4);
        types.add(Vocabulary.s_c_Agent);
    }

    public Organization(String name) {
        this();
        this.name = name;
    }

    @Override
    public void generateUri() {
        if (uri != null) {
            return;
        }
        if (name == null || name.isEmpty()) {
            throw new IllegalStateException("Cannot generate URI. Missing organization name.");
        }
        final String[] parts = name.split(" ");
        final StringBuilder sb = new StringBuilder(Constants.ORGANIZATION_BASE_URI);
        for (int i = 0; i < parts.length; i++) {
            sb.append(parts[i]);
            if (i < parts.length - 1) {
                sb.append('+');
            }
        }
        this.uri = URI.create(sb.toString());
    }

    @Override
    public URI getUri() {
        return uri;
    }

    public void setUri(URI uri) {
        this.uri = uri;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Set<String> getTypes() {
        return types;
    }

    public void setTypes(Set<String> types) {
        this.types = types;
    }

    @Override
    public String toString() {
        String res = "Organization {" + name;
        if (uri != null) {
            res += " <" + uri + '>';
        }
        res += '}';
        return res;
    }
}
