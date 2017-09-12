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
import cz.cvut.kbss.reporting.persistence.sesame.SesamePersistenceProvider;
import org.springframework.context.annotation.*;

@Configuration
@ComponentScan(basePackages = {"cz.cvut.kbss.reporting.persistence.dao",
        "cz.cvut.kbss.reporting.persistence.sesame"})
@Import({TestPersistenceFactory.class,
        TestFormGenPersistenceFactory.class})
public class TestPersistenceConfig {

    @Bean
    @Primary
    public SesamePersistenceProvider persistenceProvider() {
        return null;
    }
}
