package cz.cvut.kbss.reporting.environment.config;

import cz.cvut.kbss.reporting.persistence.sesame.DataDao;
import cz.cvut.kbss.reporting.persistence.sesame.SesamePersistenceProvider;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import static org.mockito.Mockito.mock;

@Configuration
public class MockSesamePersistence {

    @Bean
    public DataDao dataDao() {
        return mock(DataDao.class);
    }

    @Bean
    public SesamePersistenceProvider sesamePersistenceProvider() {
        return null;
    }
}
