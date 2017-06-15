package cz.cvut.kbss.reporting.config;

import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;

@Configuration
@ComponentScan(basePackages = "cz.cvut.kbss.reporting.persistence")
public class PersistenceConfig {
}
