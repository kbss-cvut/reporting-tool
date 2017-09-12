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
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import static org.mockito.Mockito.mock;
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
        return new SecurityUtils(mock(UserDetailsService.class), new BCryptPasswordEncoder());
    }

    @Bean
    public EventFormGenDataProcessor eventFormGenDataProcessor() {
        return spy(new EventFormGenDataProcessor(occurrenceReportFormGenDao(), securityUtils()));
    }
}
