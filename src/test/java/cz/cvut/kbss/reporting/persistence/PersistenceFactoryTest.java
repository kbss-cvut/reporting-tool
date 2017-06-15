package cz.cvut.kbss.reporting.persistence;

import cz.cvut.kbss.jopa.model.EntityManager;
import cz.cvut.kbss.jopa.model.EntityManagerFactory;
import cz.cvut.kbss.jopa.model.JOPAPersistenceProperties;
import cz.cvut.kbss.reporting.util.ConfigParam;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.PropertySource;
import org.springframework.core.env.Environment;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotNull;

@RunWith(SpringJUnit4ClassRunner.class)
@PropertySource("classpath:config.properties")
@ContextConfiguration(classes = {PersistenceFactory.class})
public class PersistenceFactoryTest {

    @Autowired
    private Environment environment;

    @Autowired
    private EntityManagerFactory emf;

    @Test
    public void testPersistenceInitialization() {
        assertNotNull(emf);
        final EntityManager em = emf.createEntityManager();
        try {
            assertNotNull(em);
        } finally {
            em.close();
        }
        assertEquals(environment.getProperty(ConfigParam.REPOSITORY_URL.toString()), emf.getProperties().get(
                JOPAPersistenceProperties.ONTOLOGY_PHYSICAL_URI_KEY));
    }
}