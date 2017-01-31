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
package cz.cvut.kbss.reporting.persistence.dao;

import cz.cvut.kbss.jopa.model.EntityManager;
import cz.cvut.kbss.reporting.model.Occurrence;
import cz.cvut.kbss.reporting.model.util.factorgraph.traversal.FactorGraphTraverser;
import cz.cvut.kbss.reporting.model.util.factorgraph.traversal.IdentityBasedFactorGraphTraverser;
import cz.cvut.kbss.reporting.persistence.dao.util.FactorGraphOrphanRemover;
import cz.cvut.kbss.reporting.persistence.dao.util.FactorGraphSaver;
import cz.cvut.kbss.reporting.persistence.dao.util.QuestionSaver;
import cz.cvut.kbss.reporting.util.IdentificationUtils;
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
