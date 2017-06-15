package cz.cvut.kbss.reporting.persistence.sesame;

import org.eclipse.rdf4j.model.ValueFactory;
import org.eclipse.rdf4j.repository.RepositoryConnection;
import org.eclipse.rdf4j.repository.RepositoryException;
import org.eclipse.rdf4j.rio.RDFHandler;
import org.eclipse.rdf4j.rio.RDFHandlerException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.net.URI;

@Component
public class DataDao {

    private static final Logger LOG = LoggerFactory.getLogger(DataDao.class);

    @Autowired
    private SesamePersistenceProvider sesameRepository;

    /**
     * Exports repository data from the specified context and passes it to the handler.
     *
     * @param contextUri Context from which the data should be exported. Optional
     * @param handler    Handler for the exported data
     */
    public void getRepositoryData(URI contextUri, RDFHandler handler) {
        try {
            try (final RepositoryConnection connection = sesameRepository.getRepository().getConnection()) {
                final ValueFactory valueFactory = connection.getValueFactory();
                if (contextUri != null) {
                    connection.export(handler, valueFactory.createIRI(contextUri.toString()));
                } else {
                    connection.export(handler);
                }
            }
        } catch (RepositoryException | RDFHandlerException e) {
            LOG.error("Unable to read data from repository.", e);
        }
    }
}
