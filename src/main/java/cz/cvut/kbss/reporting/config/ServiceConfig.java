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
package cz.cvut.kbss.reporting.config;

import cz.cvut.kbss.reporting.service.security.DisabledLoginTracker;
import cz.cvut.kbss.reporting.service.security.LoginTracker;
import cz.cvut.kbss.reporting.service.security.RuntimeBasedLoginTracker;
import cz.cvut.kbss.reporting.util.ConfigParam;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.env.Environment;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.client.RestTemplate;

@Configuration
@ComponentScan(basePackages = "cz.cvut.kbss.reporting.service")
public class ServiceConfig {

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public RestTemplate restTemplate() {
        return new RestTemplate();
    }

    /**
     * Creates login tracker based on configuration - disabled or enabled.
     */
    @Bean
    public LoginTracker loginTracker(Environment environment) {
        final String track = environment
                .getProperty(ConfigParam.RESTRICT_LOGIN_ATTEMPTS.toString(), Boolean.FALSE.toString());
        if (Boolean.valueOf(track)) {
            return new RuntimeBasedLoginTracker();
        } else {
            return new DisabledLoginTracker();
        }
    }
}
