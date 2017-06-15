package cz.cvut.kbss.reporting.environment.config;

import cz.cvut.kbss.reporting.service.OccurrenceReportService;
import cz.cvut.kbss.reporting.service.repository.RepositoryOccurrenceReportService;
import org.mockito.Mockito;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.client.RestTemplate;

@Configuration
@ComponentScan(basePackages = "cz.cvut.kbss.reporting.service")
public class TestServiceConfig {

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public RestTemplate restTemplate() {
        return new RestTemplate();
    }

    @Bean
    public OccurrenceReportService occurrenceReportService() {
        return Mockito.spy(new RepositoryOccurrenceReportService());
    }
}
