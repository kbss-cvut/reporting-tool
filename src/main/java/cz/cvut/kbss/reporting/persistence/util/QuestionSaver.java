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
