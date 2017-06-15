package cz.cvut.kbss.reporting.persistence.sesame;

import cz.cvut.kbss.jopa.model.EntityManager;
import cz.cvut.kbss.jopa.model.EntityManagerFactory;
import cz.cvut.kbss.jopa.model.descriptors.EntityDescriptor;
import cz.cvut.kbss.reporting.environment.config.DataDaoPersistenceConfig;
import cz.cvut.kbss.reporting.environment.generator.Generator;
import cz.cvut.kbss.reporting.model.Organization;
import org.eclipse.rdf4j.common.iteration.Iterations;
import org.eclipse.rdf4j.model.Statement;
import org.eclipse.rdf4j.repository.Repository;
import org.eclipse.rdf4j.repository.RepositoryConnection;
import org.eclipse.rdf4j.repository.sail.SailRepository;
import org.eclipse.rdf4j.sail.memory.MemoryStore;
import org.junit.After;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

import java.net.URI;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

import static org.junit.Assert.assertFalse;

@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration(classes = {DataDaoPersistenceConfig.class})
@DirtiesContext(classMode = DirtiesContext.ClassMode.AFTER_EACH_TEST_METHOD)
public class DataDaoTest {

    @Autowired
    private DataDao dataDao;

    @Autowired
    private EntityManagerFactory emf;

    private Repository store;
    private RepositoryConnection connection;

    @Before
    public void setUp() throws Exception {
        this.store = new SailRepository(new MemoryStore());
        store.initialize();
    }

    @After
    public void tearDown() throws Exception {
        if (connection != null) {
            connection.close();
        }
        store.shutDown();
    }

    @Test
    public void testExportRepositoryDataFromContext() throws Exception {
        final URI context = Generator.generateUri();
        testExport(context);
    }

    private void testExport(URI context) throws Exception {
        final List<Organization> organizations = persistTestData(context);
        this.connection = store.getConnection();

        dataDao.getRepositoryData(context, new StatementCopyingHandler(connection));
        for (Organization org : organizations) {
            final Collection<Statement> res = Iterations.addAll(connection
                            .getStatements(connection.getValueFactory().createIRI(org.getUri().toString()), null, null, false),
                    new ArrayList<>());
            assertFalse(res.isEmpty());
        }
    }

    private List<Organization> persistTestData(URI contextUri) {
        final EntityManager em = emf.createEntityManager();
        final EntityDescriptor descriptor = new EntityDescriptor(contextUri);
        try {
            em.getTransaction().begin();
            final List<Organization> lst = new ArrayList<>();
            for (int i = 0; i < Generator.randomInt(10); i++) {
                final Organization org = new Organization("Organization-" + i);
                org.generateUri();
                em.persist(org, descriptor);
                lst.add(org);
            }
            em.getTransaction().commit();
            return lst;
        } finally {
            em.close();
        }
    }

    @Test
    public void testExportDataFromDefaultContext() throws Exception {
        testExport(null);
    }
}
