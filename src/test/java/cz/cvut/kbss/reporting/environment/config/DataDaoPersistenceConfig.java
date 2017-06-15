package cz.cvut.kbss.reporting.environment.config;

import cz.cvut.kbss.reporting.persistence.TestFormGenPersistenceFactory;
import cz.cvut.kbss.reporting.persistence.TestPersistenceFactory;
import cz.cvut.kbss.reporting.persistence.dao.formgen.OccurrenceReportFormGenDao;
import cz.cvut.kbss.reporting.persistence.sesame.DataDao;
import cz.cvut.kbss.reporting.persistence.sesame.SesamePersistenceProvider;
import cz.cvut.kbss.reporting.persistence.sesame.TestSesamePersistenceProvider;
import org.springframework.context.annotation.*;

import static org.mockito.Mockito.spy;

@Configuration
@ComponentScan(basePackages = {"cz.cvut.kbss.reporting.persistence.dao"})
@Import({TestPersistenceFactory.class,
        TestFormGenPersistenceFactory.class})
public class DataDaoPersistenceConfig {

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
}
