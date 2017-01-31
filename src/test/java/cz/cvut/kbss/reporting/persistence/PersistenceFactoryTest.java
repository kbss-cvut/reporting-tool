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