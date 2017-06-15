package cz.cvut.kbss.reporting.persistence.dao;

import cz.cvut.kbss.jopa.exceptions.OWLPersistenceException;
import cz.cvut.kbss.jopa.model.EntityManager;
import cz.cvut.kbss.jopa.model.EntityManagerFactory;
import cz.cvut.kbss.reporting.model.InitialReport;
import cz.cvut.kbss.reporting.persistence.PersistenceException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.util.Objects;

/**
 * DAO for creating initial reports.
 * <p>
 * Other methods are not supported, because once persisted and associated with an {@link
 * cz.cvut.kbss.reporting.model.OccurrenceReport}, the initial report is accessible only through it.
 */
@Repository
public class InitialReportDao {

    private final EntityManagerFactory emf;

    @Autowired
    public InitialReportDao(EntityManagerFactory emf) {
        this.emf = emf;
    }

    /**
     * Persists the specified initial report.
     *
     * @param initialReport The report to persist
     */
    public void persist(InitialReport initialReport) {
        Objects.requireNonNull(initialReport);
        final EntityManager em = emf.createEntityManager();
        try {
            em.getTransaction().begin();
            em.persist(initialReport);
            em.getTransaction().commit();
        } catch (OWLPersistenceException e) {
            throw new PersistenceException("Unable to persist initial report " + initialReport + ".", e);
        } finally {
            em.close();
        }
    }
}
