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
package cz.cvut.kbss.reporting.service.jmx;

import cz.cvut.kbss.jopa.model.EntityManagerFactory;
import cz.cvut.kbss.reporting.environment.config.PropertyMockingApplicationContextInitializer;
import cz.cvut.kbss.reporting.environment.generator.Generator;
import cz.cvut.kbss.reporting.model.Person;
import cz.cvut.kbss.reporting.service.BaseServiceTestRunner;
import cz.cvut.kbss.reporting.service.ConfigReader;
import cz.cvut.kbss.reporting.service.PersonService;
import cz.cvut.kbss.reporting.util.ConfigParam;
import cz.cvut.kbss.reporting.util.Constants;
import org.junit.After;
import org.junit.Before;
import org.junit.Test;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.core.env.Environment;
import org.springframework.mock.env.MockEnvironment;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.context.ContextConfiguration;

import java.io.File;
import java.nio.file.Files;
import java.util.List;
import java.util.stream.Collectors;

import static org.hamcrest.CoreMatchers.containsString;
import static org.junit.Assert.*;
import static org.mockito.Matchers.any;
import static org.mockito.Mockito.verify;

@ContextConfiguration(initializers = PropertyMockingApplicationContextInitializer.class)
public class AppAdminBeanTest extends BaseServiceTestRunner {

    @Autowired
    private Environment environment;

    @Autowired
    private PersonService personService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private EntityManagerFactory emf;

    @Autowired
    private ConfigReader configReader;

    @Mock
    private ApplicationEventPublisher publisherMock;

    private AppAdminBean adminBean;

    @Before
    public void setUp() {
        MockitoAnnotations.initMocks(this);
        this.adminBean = new AppAdminBean(emf, configReader, personService);
        adminBean.setApplicationEventPublisher(publisherMock);
        // Randomize admin credentials folder
        final String folder =
                System.getProperty("java.io.tmpdir") + File.separator + Integer.toString(Generator.randomInt(10000));
        ((MockEnvironment) environment).setProperty(ConfigParam.ADMIN_CREDENTIALS_LOCATION.toString(), folder);
    }

    @After
    public void tearDown() throws Exception {
        final String path = environment.getProperty(ConfigParam.ADMIN_CREDENTIALS_LOCATION.toString());
        final File dir = new File(path);
        if (dir.listFiles() != null) {
            for (File child : dir.listFiles()) {
                Files.deleteIfExists(child.toPath());
            }
        }
        Files.deleteIfExists(dir.toPath());
    }

    @Test
    public void invalidateCachePublishesEventThatInvalidatesCaches() {
        adminBean.invalidateCaches();
        verify(publisherMock).publishEvent(any());
    }

    @Test
    public void persistsSystemAdminWhenHeDoesNotExist() {
        adminBean.initSystemAdmin();
        final Person result = personService.findByUsername(Constants.SYSTEM_ADMIN.getUsername());
        assertNotNull(result);
    }

    @Test
    public void doesNotCreateNewAdminWhenOneAlreadyExists() {
        adminBean.initSystemAdmin();
        final Person admin = personService.findByUsername(Constants.SYSTEM_ADMIN.getUsername());
        adminBean.initSystemAdmin();
        final Person result = personService.findByUsername(Constants.SYSTEM_ADMIN.getUsername());
        // We know that password is generated, so the same password means no new instance was created
        assertEquals(admin.getPassword(), result.getPassword());
    }

    @Test
    public void savesAdminLoginCredentialsIntoHiddenFileInUserHome() throws Exception {
        adminBean.initSystemAdmin();
        final Person admin = personService.findByUsername(Constants.SYSTEM_ADMIN.getUsername());
        final String home = environment.getProperty(ConfigParam.ADMIN_CREDENTIALS_LOCATION.toString());
        final File credentialsFile = new File(home + File.separator + Constants.ADMIN_CREDENTIALS_FILE);
        assertTrue(credentialsFile.exists());
        assertTrue(credentialsFile.isHidden());
        final List<String> lines = Files.lines(credentialsFile.toPath()).collect(Collectors.toList());
        assertThat(lines.get(0), containsString(admin.getUsername() + "/"));
        final String password = lines.get(0).substring(lines.get(0).indexOf('/') + 1);
        assertTrue(passwordEncoder.matches(password, admin.getPassword()));
    }
}
