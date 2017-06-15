package cz.cvut.kbss.reporting.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.EnableMBeanExport;
import org.springframework.context.annotation.Import;

@Configuration
@EnableMBeanExport
@Import({WebAppConfig.class, PersistenceConfig.class, ServiceConfig.class})
public class AppConfig {
}
