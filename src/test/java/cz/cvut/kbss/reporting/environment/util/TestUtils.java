package cz.cvut.kbss.reporting.environment.util;

import cz.cvut.kbss.jopa.model.EntityManager;
import cz.cvut.kbss.jopa.model.EntityManagerFactory;
import cz.cvut.kbss.reporting.model.qam.Question;

import java.lang.reflect.Field;
import java.net.URI;
import java.util.function.Consumer;

import static org.junit.Assert.assertFalse;

public class TestUtils {

    private TestUtils() {
        throw new AssertionError();
    }

    /**
     * Sets value of the specified field to the specified value.
     *
     * @param field  The field to set
     * @param target Target on which the field value will be set. Can be {@code null} for static fields
     * @param value  The value to use
     */
    public static void setFieldValue(Field field, Object target, Object value) throws IllegalAccessException {
        if (!field.isAccessible()) {
            field.setAccessible(true);
        }
        field.set(target, value);
    }

    /**
     * Verifies question structure, calling the specified consumer to verify the specified question and then recursively
     * verifying the question's descendants.
     *
     * @param question The root question to verify
     * @param consumer Verification function
     */
    public static void verifyQuestions(Question question, Consumer<Question> consumer) {
        consumer.accept(question);
        question.getSubQuestions().forEach(sq -> verifyQuestions(sq, consumer));
    }

    /**
     * Checks that there are no instances of the specified class in the repository.
     * @param emf Persistence context factory
     * @param classIri IRI of the class to check
     */
    public static void verifyAllInstancesRemoved(EntityManagerFactory emf, String classIri) {
        final EntityManager em = emf.createEntityManager();
        try {
            final Boolean res = em.createNativeQuery("ASK WHERE { ?x a ?type . }", Boolean.class)
                                  .setParameter("type", URI.create(classIri))
                                  .getSingleResult();
            assertFalse(res);
        } finally {
            em.close();
        }
    }
}
