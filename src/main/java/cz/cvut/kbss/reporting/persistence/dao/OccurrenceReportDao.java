package cz.cvut.kbss.reporting.persistence.dao;

import cz.cvut.kbss.jopa.exceptions.NoResultException;
import cz.cvut.kbss.jopa.model.EntityManager;
import cz.cvut.kbss.reporting.model.Occurrence;
import cz.cvut.kbss.reporting.model.OccurrenceReport;
import cz.cvut.kbss.reporting.model.Vocabulary;
import cz.cvut.kbss.reporting.persistence.util.OrphanRemover;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.net.URI;

@Repository
public class OccurrenceReportDao extends BaseReportDao<OccurrenceReport> implements GenericDao<OccurrenceReport> {

    private final OccurrenceDao occurrenceDao;

    @Autowired
    public OccurrenceReportDao(OccurrenceDao occurrenceDao) {
        super(OccurrenceReport.class);
        this.occurrenceDao = occurrenceDao;
    }

    @Override
    protected void persist(OccurrenceReport entity, EntityManager em) {
        assert entity != null;
        if (entity.getOccurrence() != null && entity.getOccurrence().getUri() == null) {
            occurrenceDao.persist(entity.getOccurrence(), em);
        }
        super.persist(entity, em);
    }

    @Override
    protected void update(OccurrenceReport entity, EntityManager em) {
        final OccurrenceReport original = em.find(OccurrenceReport.class, entity.getUri());
        assert original != null;
        em.detach(original);
        final OccurrenceReport merged = em.merge(entity);
        new OrphanRemover(em).removeOrphans(original.getCorrectiveMeasures(), merged.getCorrectiveMeasures());
        occurrenceDao.update(entity.getOccurrence(), em);
    }

    @Override
    protected void remove(OccurrenceReport entity, EntityManager em) {
        occurrenceDao.remove(entity.getOccurrence(), em);
        super.remove(entity, em);
    }

    /**
     * Gets reports concerning the specified occurrence.
     * <p>
     * Only latest revisions of reports of every report chain are returned.
     *
     * @param occurrence The occurrence to filter reports by
     * @return List of reports
     */
    public OccurrenceReport findByOccurrence(Occurrence occurrence) {
        final EntityManager em = entityManager();
        try {
            return em.createNativeQuery(
                    "SELECT ?x WHERE { ?x a ?type ;" +
                            "?documents ?occurrence . }",
                    OccurrenceReport.class)
                     .setParameter("type", typeIri)
                     .setParameter("documents", URI.create(Vocabulary.s_p_documents))
                     .setParameter("occurrence", occurrence.getUri())
                     .getSingleResult();
        } catch (NoResultException e) {
            return null;
        } finally {
            em.close();
        }
    }
}
