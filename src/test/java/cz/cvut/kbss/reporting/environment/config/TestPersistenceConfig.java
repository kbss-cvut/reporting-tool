package cz.cvut.kbss.reporting.environment.config;

import cz.cvut.kbss.reporting.persistence.TestPersistenceFactory;
import cz.cvut.kbss.reporting.persistence.sesame.SesamePersistenceProvider;
import org.springframework.context.annotation.*;

@Configuration
@ComponentScan(basePackages = {"cz.cvut.kbss.reporting.persistence.dao",
        "cz.cvut.kbss.reporting.persistence.sesame"})
@Import({TestPersistenceFactory.class})
public class TestPersistenceConfig {

    @Bean
    @Primary
    public SesamePersistenceProvider persistenceProvider() {
        return null;
    }
}
