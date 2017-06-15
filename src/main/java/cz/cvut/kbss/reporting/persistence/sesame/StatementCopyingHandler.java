package cz.cvut.kbss.reporting.persistence.sesame;

import org.eclipse.rdf4j.model.IRI;
import org.eclipse.rdf4j.model.Statement;
import org.eclipse.rdf4j.repository.RepositoryConnection;
import org.eclipse.rdf4j.repository.RepositoryException;
import org.eclipse.rdf4j.rio.RDFHandlerException;
import org.eclipse.rdf4j.rio.helpers.AbstractRDFHandler;

import java.util.Objects;

/**
 * Sesame RDF handler which takes the provided statements and adds them into the target connection.
 * <p>
 * A target context can be provided, but is optional.
 */
public class StatementCopyingHandler extends AbstractRDFHandler {

    private final RepositoryConnection connection;
    private final IRI context;

    public StatementCopyingHandler(RepositoryConnection connection) {
        Objects.requireNonNull(connection);
        this.connection = connection;
        this.context = null;
    }

    public StatementCopyingHandler(RepositoryConnection connection, java.net.URI context) {
        Objects.requireNonNull(connection);
        Objects.requireNonNull(context);
        this.connection = connection;
        this.context = connection.getValueFactory().createIRI(context.toString());
    }

    @Override
    public void handleStatement(Statement st) throws RDFHandlerException {
        try {
            connection.add(st, context);
        } catch (RepositoryException e) {
            throw new RDFHandlerException(e);
        }
    }
}
