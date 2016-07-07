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

import cz.cvut.kbss.reporting.model.CorrectiveMeasureRequest;
import cz.cvut.kbss.reporting.model.Occurrence;
import cz.cvut.kbss.reporting.model.OccurrenceReport;
import cz.cvut.kbss.reporting.model.Vocabulary;
import cz.cvut.kbss.jopa.model.EntityManager;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.net.URI;
import java.util.Collections;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Repository
public class OccurrenceReportDao extends BaseReportDao<OccurrenceReport> implements GenericDao<OccurrenceReport> {

    @Autowired
    private OccurrenceDao occurrenceDao;

    public OccurrenceReportDao() {
        super(OccurrenceReport.class);
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
        if (entity.getUri() != null) {
            updateWithOrphanRemoval(entity, em);
        } else {
            em.merge(entity);
        }
    }

    private void updateWithOrphanRemoval(OccurrenceReport entity, EntityManager em) {
        final OccurrenceReport original = em.find(OccurrenceReport.class, entity.getUri());
        final Set<URI> measureUris = entity.getCorrectiveMeasures() == null ? Collections.emptySet() :
                                     entity.getCorrectiveMeasures().stream()
                                           .map(CorrectiveMeasureRequest::getUri).collect(Collectors.toSet());
        final Set<CorrectiveMeasureRequest> orphans =
                original.getCorrectiveMeasures() == null ? Collections.emptySet() :
                original.getCorrectiveMeasures().stream().filter(m -> !measureUris.contains(m.getUri()))
                        .collect(Collectors.toSet());
        em.merge(entity);
        occurrenceDao.update(entity.getOccurrence(), em);
        orphans.forEach(em::remove);
    }

    /**
     * Gets reports concerning the specified occurrence.
     * <p>
     * Only latest revisions of reports of every report chain are returned.
     *
     * @param occurrence The occurrence to filter reports by
     * @return List of reports
     */
    public List<OccurrenceReport> findByOccurrence(Occurrence occurrence) {
        final EntityManager em = entityManager();
        try {
            return em.createNativeQuery(
                    "SELECT ?x WHERE { ?x a ?type ;" +
                            "?hasRevision ?revision ;" +
                            "?hasFileNumber ?fileNo ;" +
                            "?documents ?occurrence . " +
                            "?occurrence ?hasStartTime ?startTime ." +
                            // Use only the max revision reports
                            "{ SELECT (MAX(?rev) AS ?maxRev) ?iFileNo WHERE " +
                            "{ ?y a ?type ; ?documents ?occurrence ; ?hasFileNumber ?iFileNo ; ?hasRevision ?rev . }" +
                            " GROUP BY ?iFileNo }" +
                            "FILTER (?revision = ?maxRev && ?fileNo = ?iFileNo)" +
                            "} ORDER BY DESC(?startTime) DESC(?revision)",
                    OccurrenceReport.class)
                     .setParameter("type", typeIri)
                     .setParameter("occurrence", occurrence.getUri())
                     .setParameter("hasRevision", URI.create(Vocabulary.s_p_has_revision))
                     .setParameter("documents", URI.create(Vocabulary.s_p_documents))
                     .setParameter("hasStartTime", URI.create(Vocabulary.s_p_has_start_time))
                     .setParameter("hasFileNumber", URI.create(Vocabulary.s_p_has_file_number))
                     .getResultList();
        } finally {
            em.close();
        }
    }
}
