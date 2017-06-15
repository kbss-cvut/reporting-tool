package cz.cvut.kbss.reporting.persistence;

import cz.cvut.kbss.jopa.Persistence;
import cz.cvut.kbss.jopa.model.EntityManagerFactory;
import cz.cvut.kbss.jopa.model.JOPAPersistenceProperties;
import cz.cvut.kbss.reporting.util.ConfigParam;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.PropertySource;
import org.springframework.core.env.Environment;

import javax.annotation.PostConstruct;
import javax.annotation.PreDestroy;
import java.util.Map;

@Configuration
@PropertySource("classpath:config.properties")
public class TestFormGenPersistenceFactory {

    private static final String URL_PROPERTY = "test." + ConfigParam.FORM_GEN_REPOSITORY_URL.toString();
    private static final String DRIVER_PROPERTY = "test." + ConfigParam.DRIVER.toString();

    @Autowired
    private Environment environment;

    private EntityManagerFactory emf;

    @Bean(name = "formGen")
    public EntityManagerFactory getEntityManagerFactory() {
        return emf;
    }

    @PostConstruct
    private void init() {
        final Map<String, String> properties = TestPersistenceFactory.getDefaultProperties();
        properties.put(JOPAPersistenceProperties.ONTOLOGY_PHYSICAL_URI_KEY, environment.getProperty(URL_PROPERTY));
        properties.put(JOPAPersistenceProperties.DATA_SOURCE_CLASS, environment.getProperty(DRIVER_PROPERTY));
        this.emf = Persistence.createEntityManagerFactory("formGenTestPU", properties);
    }

    @PreDestroy
    private void close() {
        if (emf.isOpen()) {
            emf.close();
        }
    }
}
