package cz.cvut.kbss.reporting.environment.config;

import cz.cvut.kbss.reporting.persistence.TestFormGenPersistenceFactory;
import cz.cvut.kbss.reporting.persistence.TestPersistenceFactory;
import cz.cvut.kbss.reporting.persistence.dao.formgen.OccurrenceReportFormGenDao;
import cz.cvut.kbss.reporting.persistence.sesame.DataDao;
import cz.cvut.kbss.reporting.persistence.sesame.SesamePersistenceProvider;
import cz.cvut.kbss.reporting.persistence.sesame.TestSesamePersistenceProvider;
import cz.cvut.kbss.reporting.service.formgen.EventFormGenDataProcessor;
import cz.cvut.kbss.reporting.service.security.SecurityUtils;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Import;
import org.springframework.context.annotation.Primary;

import static org.mockito.Mockito.spy;

@Configuration
@Import({TestPersistenceFactory.class,
        TestFormGenPersistenceFactory.class,})
public class TestFormGenConfig {

    @Bean
    @Primary
    public SesamePersistenceProvider sesamePersistenceProvider() {
        return new TestSesamePersistenceProvider();
    }

    @Bean
    public DataDao dataDao() {
        return new DataDao();
    }

    @Bean
    public OccurrenceReportFormGenDao occurrenceReportFormGenDao() {
        return spy(new OccurrenceReportFormGenDao());
    }

    @Bean
    public SecurityUtils securityUtils() {
        return new SecurityUtils();
    }

    @Bean
    public EventFormGenDataProcessor eventFormGenDataProcessor() {
        return spy(new EventFormGenDataProcessor(occurrenceReportFormGenDao(), securityUtils()));
    }
}
