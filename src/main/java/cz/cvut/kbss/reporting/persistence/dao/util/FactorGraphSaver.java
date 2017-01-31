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
package cz.cvut.kbss.reporting.persistence.dao.util;

import cz.cvut.kbss.jopa.model.EntityManager;
import cz.cvut.kbss.reporting.model.Event;
import cz.cvut.kbss.reporting.model.Occurrence;
import cz.cvut.kbss.reporting.model.Vocabulary;
import cz.cvut.kbss.reporting.model.util.factorgraph.FactorGraphNodeVisitor;

import java.net.URI;

public class FactorGraphSaver implements FactorGraphNodeVisitor {

    private final EntityManager em;
    private final QuestionSaver questionSaver;

    public FactorGraphSaver(EntityManager em, QuestionSaver questionSaver) {
        this.em = em;
        this.questionSaver = questionSaver;
    }

    @Override
    public void visit(Occurrence occurrence) {
        // Occurrence is persisted separately, just save the question
        if (occurrence.getQuestion() != null) {
            questionSaver.persistIfNecessary(occurrence.getQuestion(), em);
        }
    }

    @Override
    public void visit(Event event) {
        // TODO Fix JOPA: it generates IDs for elements referenced by persisted instances
        if (event.getUri() == null || !exists(event.getUri())) {
            em.persist(event);
            if (event.getQuestion() != null) {
                questionSaver.persistIfNecessary(event.getQuestion(), em);
            }
        }
    }

    private boolean exists(URI uri) {
        return em.createNativeQuery("ASK { ?x a ?type .}", Boolean.class)
                 .setParameter("x", uri)
                 .setParameter("type", URI.create(Vocabulary.s_c_Event)).getSingleResult();
    }
}
