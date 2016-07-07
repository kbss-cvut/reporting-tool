package cz.cvut.kbss.reporting.persistence.sesame;

import org.openrdf.repository.RepositoryConnection;
import org.openrdf.repository.RepositoryException;
import org.openrdf.rio.RDFHandler;
import org.openrdf.rio.RDFHandlerException;
import org.openrdf.rio.rdfxml.util.RDFXMLPrettyWriter;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.io.ByteArrayOutputStream;

@Component
public class DataDao {

    private static final Logger LOG = LoggerFactory.getLogger(DataDao.class);

    @Autowired
    private SesamePersistenceProvider sesameRepository;

    /**
     * Gets raw content of the repository.
     * <p>
     * The data are serialized using Sesame's {@link RDFXMLPrettyWriter}.
     *
     * @return Repository content serialized as String
     */
    public String getRepositoryData() {
        try {
            final RepositoryConnection connection = sesameRepository.getRepository().getConnection();
            final ByteArrayOutputStream bos = new ByteArrayOutputStream();
            final RDFHandler rdfHandler = new RDFXMLPrettyWriter(bos);
            connection.export(rdfHandler);
            connection.close();
            return new String(bos.toByteArray());
        } catch (RepositoryException | RDFHandlerException e) {
            LOG.error("Unable to read data from repository.", e);
            return "";
        }
    }
}
