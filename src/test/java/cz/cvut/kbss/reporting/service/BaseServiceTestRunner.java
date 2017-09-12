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
package cz.cvut.kbss.reporting.service;

import cz.cvut.kbss.reporting.environment.config.MockSesamePersistence;
import cz.cvut.kbss.reporting.environment.config.TestPersistenceConfig;
import cz.cvut.kbss.reporting.environment.config.TestServiceConfig;
import cz.cvut.kbss.reporting.environment.generator.Generator;
import cz.cvut.kbss.reporting.model.Person;
import cz.cvut.kbss.reporting.persistence.dao.PersonDao;
import cz.cvut.kbss.reporting.util.ConfigParam;
import cz.cvut.kbss.reporting.util.Constants;
import org.junit.AfterClass;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

import java.io.File;
import java.io.IOException;
import java.util.Properties;

@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration(classes = {TestServiceConfig.class, TestPersistenceConfig.class, MockSesamePersistence.class})
@DirtiesContext(classMode = DirtiesContext.ClassMode.AFTER_EACH_TEST_METHOD)
public abstract class BaseServiceTestRunner {

    @Autowired
    protected PersonDao personDao;

    @Autowired
    protected PasswordEncoder passwordEncoder;

    protected Person persistPerson() {
        final Person p = Generator.getPerson();
        p.encodePassword(passwordEncoder);
        personDao.persist(p);
        return p;
    }

    @AfterClass
    public static void tearDownAfterClass() throws Exception {
        deleteAdminCredentialsFile();
    }

    protected static void deleteAdminCredentialsFile() throws IOException {
        final Properties props = new Properties();
        props.load(BaseServiceTestRunner.class.getClassLoader().getResourceAsStream("config.properties"));
        final File credentialsFile = new File(
                props.getProperty(ConfigParam.ADMIN_CREDENTIALS_LOCATION.toString()) + File.separator +
                        Constants.ADMIN_CREDENTIALS_FILE);
        if (credentialsFile.exists()) {
            credentialsFile.delete();
        }
    }
}
