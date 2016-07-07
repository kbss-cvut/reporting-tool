package cz.cvut.kbss.reporting.persistence.sesame;

import cz.cvut.kbss.reporting.persistence.PersistenceException;
import cz.cvut.kbss.reporting.util.ConfigParam;
import org.openrdf.repository.Repository;
import org.openrdf.repository.RepositoryException;
import org.openrdf.repository.config.RepositoryConfigException;
import org.openrdf.repository.manager.RepositoryProvider;
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
