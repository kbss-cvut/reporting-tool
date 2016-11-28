package cz.cvut.kbss.reporting.persistence.dao;

import cz.cvut.kbss.inbas.reporting.model.Occurrence;
import cz.cvut.kbss.inbas.reporting.model.util.factorgraph.traversal.FactorGraphTraverser;
import cz.cvut.kbss.inbas.reporting.model.util.factorgraph.traversal.IdentityBasedFactorGraphTraverser;
import cz.cvut.kbss.inbas.reporting.persistence.dao.util.FactorGraphOrphanRemover;
import cz.cvut.kbss.inbas.reporting.persistence.dao.util.FactorGraphSaver;
import cz.cvut.kbss.inbas.reporting.persistence.dao.util.QuestionSaver;
import cz.cvut.kbss.inbas.reporting.util.IdentificationUtils;
import cz.cvut.kbss.jopa.model.EntityManager;
import org.springframework.stereotype.Repository;

@Repository
public class OccurrenceDao extends OwlKeySupportingDao<Occurrence> {

    public OccurrenceDao() {
        super(Occurrence.class);
    }

    @Override
    protected void persist(Occurrence entity, final EntityManager em) {
        assert entity != null;
        entity.setKey(IdentificationUtils.generateKey());
        final FactorGraphSaver saver = new FactorGraphSaver(em, new QuestionSaver());
        final FactorGraphTraverser traverser = new IdentityBasedFactorGraphTraverser(saver, null);
        traverser.traverse(entity);
        em.persist(entity);
    }

    @Override
    protected void update(Occurrence entity, EntityManager em) {
        final Occurrence original = em.find(Occurrence.class, entity.getUri());
        new FactorGraphOrphanRemover(em).removeOrphans(original, entity);
        final FactorGraphSaver saver = new FactorGraphSaver(em, new QuestionSaver());
        final FactorGraphTraverser traverser = new IdentityBasedFactorGraphTraverser(saver, null);
        traverser.traverse(entity);
        em.merge(entity);
    }
}
