package cz.cvut.kbss.reporting.persistence.dao.formgen;

import cz.cvut.kbss.jopa.model.EntityManager;
import cz.cvut.kbss.jopa.model.descriptors.Descriptor;
import cz.cvut.kbss.reporting.model.Event;
import cz.cvut.kbss.reporting.model.Occurrence;
import cz.cvut.kbss.reporting.model.OccurrenceReport;
import cz.cvut.kbss.reporting.persistence.sesame.DataDao;
import cz.cvut.kbss.reporting.persistence.sesame.StatementCopyingHandler;
import cz.cvut.kbss.reporting.persistence.util.QuestionSaver;
import cz.cvut.kbss.reporting.util.IdentificationUtils;
import org.eclipse.rdf4j.repository.RepositoryConnection;
import org.eclipse.rdf4j.repository.RepositoryException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.net.URI;
import java.util.IdentityHashMap;
import java.util.Map;

@Repository
public class OccurrenceReportFormGenDao extends FormGenDao<OccurrenceReport> {

    static final String REPORT_CONTEXT_NAME = "reportGraphId";
    static final String DATA_CONTEXT_NAME = "dataGraphId";

    @Autowired
    private DataDao dataDao;

    @Override
    void prePersist(OccurrenceReport instance, EntityManager em, Descriptor descriptor) {
        if (instance.getKey() == null || instance.getKey().isEmpty()) {
            instance.setKey(IdentificationUtils.generateKey());
        }
        if (instance.getOccurrence().getKey() == null || instance.getOccurrence().getKey().isEmpty()) {
            instance.getOccurrence().setKey(IdentificationUtils.generateKey());
        }
        em.persist(instance.getAuthor(), descriptor);
        if (instance.getLastModifiedBy() != null &&
                !instance.getLastModifiedBy().getUri().equals(instance.getAuthor().getUri())) {
            em.persist(instance.getLastModifiedBy(), descriptor);
        }
        instance.setInitialReport(null);
        persistEventsIfNecessary(instance.getOccurrence(), em, descriptor);
        em.persist(instance.getOccurrence(), descriptor);
        super.prePersist(instance, em, descriptor);
    }

    private void persistEventsIfNecessary(Occurrence entity, EntityManager em, Descriptor descriptor) {
        final Map<Event, Object> visited = new IdentityHashMap<>();
        final QuestionSaver questionSaver = new QuestionSaver(descriptor);
        if (entity.getChildren() != null) {
            entity.getChildren().forEach(e -> persistEventIfNecessary(e, em, descriptor, visited, questionSaver));
        }
        if (entity.getFactors() != null) {
            entity.getFactors()
                  .forEach(f -> persistEventIfNecessary(f.getEvent(), em, descriptor, visited, questionSaver));
        }
    }

    private void persistEventIfNecessary(Event event, final EntityManager em, Descriptor descriptor,
                                         Map<Event, Object> visited, QuestionSaver questionSaver) {
        if (visited.containsKey(event)) {
            return;
        }
        visited.put(event, null);
        if (event.getChildren() != null) {
            event.getChildren().forEach(e -> persistEventIfNecessary(e, em, descriptor, visited, questionSaver));
        }
        if (event.getFactors() != null) {
            event.getFactors()
                 .forEach(f -> persistEventIfNecessary(f.getEvent(), em, descriptor, visited, questionSaver));
        }
        em.persist(event, descriptor);
        if (event.getQuestion() != null) {
            questionSaver.persistIfNecessary(event.getQuestion(), em);
        }
    }

    @Override
    void postPersist(OccurrenceReport instance, EntityManager em, Map<String, URI> contexts) {
        assert contexts.containsKey(MAIN_CONTEXT);

        final URI ctx = contexts.remove(MAIN_CONTEXT);
        contexts.put(REPORT_CONTEXT_NAME, ctx);
        final URI dataCtx = copyE5Data(instance.getUri(), em);
        contexts.put(DATA_CONTEXT_NAME, dataCtx);
        super.postPersist(instance, em, contexts);
    }

    private URI copyE5Data(URI contextUri, EntityManager em) {
        final URI targetContext = generateContextUri();
        try {
            final org.eclipse.rdf4j.repository.Repository targetRepository = em
                    .unwrap(org.eclipse.rdf4j.repository.Repository.class);
            try (final RepositoryConnection targetConnection = targetRepository.getConnection()) {
                targetConnection.begin();
                dataDao.getRepositoryData(contextUri, new StatementCopyingHandler(targetConnection, targetContext));
                targetConnection.commit();
            }
        } catch (RepositoryException e) {
            LOG.error("Unable to copy E5Data.", e);
        }
        return targetContext;
    }
}
