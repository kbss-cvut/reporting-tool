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
