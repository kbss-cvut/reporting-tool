package cz.cvut.kbss.reporting.service.validation;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class ValidatorFactory {

    @Bean
    public ReportValidator reportValidator() {
        return new ReportValidator();
    }

    @Bean
    public OccurrenceReportValidator occurrenceReportValidator(ReportValidator reportValidator) {
        return new OccurrenceReportValidator(reportValidator);
    }
}
