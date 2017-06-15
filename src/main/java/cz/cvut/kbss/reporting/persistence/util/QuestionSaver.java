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
package cz.cvut.kbss.reporting.persistence.util;

import cz.cvut.kbss.jopa.model.EntityManager;
import cz.cvut.kbss.jopa.model.descriptors.Descriptor;
import cz.cvut.kbss.reporting.model.qam.Question;

import java.net.URI;
import java.util.HashSet;
import java.util.Set;

/**
 * Recursively persists questions, handling references to the same question instance (they have the same URI).
 * <p>
 * The questions can be persisted into the default context, or into a named context specified by a {@link Descriptor}.
 */
public class QuestionSaver {

    private final Descriptor descriptor;
    private Set<URI> visited = new HashSet<>();

    public QuestionSaver() {
        this.descriptor = null;
    }

    public QuestionSaver(Descriptor descriptor) {
        this.descriptor = descriptor;
    }

    public void persistIfNecessary(Question root, EntityManager em) {
        if (visited.contains(root.getUri())) {
            return;
        }
        persist(root, em);
        visited.add(root.getUri());
        root.getSubQuestions().forEach(q -> this.persistSubQuestionIfNecessary(q, em));
    }

    private void persist(Question question, EntityManager em) {
        if (descriptor != null) {
            em.persist(question, descriptor);
        } else {
            em.persist(question);
        }
    }

    private void persistSubQuestionIfNecessary(Question question, EntityManager em) {
        if (visited.contains(question.getUri())) {
            return;
        }
        persist(question, em);
        visited.add(question.getUri());
        question.getSubQuestions().forEach(q -> persistSubQuestionIfNecessary(q, em));
    }
}
