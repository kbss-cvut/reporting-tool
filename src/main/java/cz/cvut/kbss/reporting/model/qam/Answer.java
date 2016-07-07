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
/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package cz.cvut.kbss.reporting.model.qam;

import cz.cvut.kbss.reporting.model.Vocabulary;
import cz.cvut.kbss.jopa.model.annotations.*;

import java.net.URI;
import java.util.HashSet;
import java.util.Set;

/**
 * @author Bogdan Kostov <bogdan.kostov@fel.cvut.cz>
 */
@OWLClass(iri = Vocabulary.s_c_answer)
public class Answer {

    @Id(generated = true)
    private URI uri;

    @OWLDataProperty(iri = Vocabulary.s_p_has_data_value)
    private String textValue;

    @OWLObjectProperty(iri = Vocabulary.s_p_has_object_value)
    private URI codeValue;

    @OWLObjectProperty(iri = Vocabulary.s_p_has_answer_origin)
    private URI origin;

    @Types
    private Set<String> types = new HashSet<>();

    public Answer() {
    }

    public Answer(Answer other) {
        this.textValue = other.textValue;
        this.codeValue = other.codeValue;
        this.origin = other.origin;
        if (other.types != null) {
            this.types.addAll(other.types);
        }
    }

    public URI getUri() {
        return uri;
    }

    public void setUri(URI uri) {
        this.uri = uri;
    }

    public String getTextValue() {
        return textValue;
    }

    public void setTextValue(String textValue) {
        this.textValue = textValue;
    }

    public URI getCodeValue() {
        return codeValue;
    }

    public void setCodeValue(URI codeValue) {
        this.codeValue = codeValue;
    }

    public URI getOrigin() {
        return origin;
    }

    public void setOrigin(URI origin) {
        this.origin = origin;
    }

    public Set<String> getTypes() {
        return types;
    }

    public void setTypes(Set<String> types) {
        this.types = types;
    }

    @Override
    public String toString() {
        if (textValue != null && codeValue != null) {
            return "value=" + textValue + ", code=" + codeValue;
        } else if (textValue == null) {
            return "code=" + codeValue;
        } else {
            return "text=" + textValue;
        }
    }
}
