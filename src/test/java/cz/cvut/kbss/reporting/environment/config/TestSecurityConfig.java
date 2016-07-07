package cz.cvut.kbss.reporting.environment.config;

import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;

@Configuration
@ComponentScan(basePackages = "cz.cvut.kbss.reporting.security")
public class TestSecurityConfig {
}
