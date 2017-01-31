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

import cz.cvut.kbss.jopa.model.annotations.*;
import cz.cvut.kbss.reporting.model.AbstractEntity;
import cz.cvut.kbss.reporting.model.Vocabulary;

import java.io.Serializable;
import java.net.URI;
import java.util.HashSet;
import java.util.Set;
import java.util.stream.Collectors;

/**
 * @author Bogdan Kostov <bogdan.kostov@fel.cvut.cz>
 */
@OWLClass(iri = Vocabulary.s_c_question)
public class Question extends AbstractEntity implements Serializable {

    @OWLObjectProperty(iri = Vocabulary.s_p_has_related_question, cascade = {CascadeType.MERGE,
            CascadeType.REMOVE}, fetch = FetchType.EAGER)
    private Set<Question> subQuestions = new HashSet<>();

    @OWLObjectProperty(iri = Vocabulary.s_p_has_answer, cascade = {CascadeType.ALL}, fetch = FetchType.EAGER)
    private Set<Answer> answers = new HashSet<>();// entity instance or attribute value

    @OWLObjectProperty(iri = Vocabulary.s_p_has_question_origin)
    private URI origin;

    // eccairs entity/attribute
    @Types
    private Set<String> types = new HashSet<>();

    public Question() {
    }

    public Question(Question other) {
        if (other.subQuestions != null) {
            this.subQuestions = other.subQuestions.stream().map(Question::new).collect(Collectors.toSet());
        }
        if (other.answers != null) {
            this.answers = other.answers.stream().map(Answer::new).collect(Collectors.toSet());
        }
        if (other.types != null) {
            this.types.addAll(other.types);
        }
        this.origin = other.origin;
    }

    public Set<Question> getSubQuestions() {
        return subQuestions;
    }

    public void setSubQuestions(Set<Question> subQuestions) {
        this.subQuestions = subQuestions;
    }

    public Set<Answer> getAnswers() {
        return answers;
    }

    public void setAnswers(Set<Answer> answers) {
        this.answers = answers;
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
        return "Question (" + types + "){" +
                "answers=" + answers +
                ", subQuestions=" + subQuestions +
                '}';
    }
}
