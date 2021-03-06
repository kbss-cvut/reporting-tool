/**
 * Copyright (C) 2017 Czech Technical University in Prague
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

import cz.cvut.kbss.reporting.persistence.PersistenceException;
import cz.cvut.kbss.reporting.util.ConfigParam;
import org.eclipse.rdf4j.repository.Repository;
import org.eclipse.rdf4j.repository.RepositoryException;
import org.eclipse.rdf4j.repository.config.RepositoryConfigException;
import org.eclipse.rdf4j.repository.manager.RepositoryProvider;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.env.Environment;
import org.springframework.stereotype.Component;

@Component
public class SesamePersistenceProvider {

    private static final Logger LOG = LoggerFactory.getLogger(SesamePersistenceProvider.class);

    @Autowired
    private Environment environment;

    public Repository getRepository() {
        final String repoUrl = environment.getProperty(ConfigParam.REPOSITORY_URL.toString());
        try {
            final Repository repository = RepositoryProvider.getRepository(repoUrl);
            assert repository.isInitialized();
            return repository;
        } catch (RepositoryException | RepositoryConfigException e) {
            LOG.error("Unable to connect to Sesame repository at " + repoUrl, e);
            throw new PersistenceException("Unable to initialize direct Sesame connection.", e);
        }
    }
}
