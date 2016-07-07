package cz.cvut.kbss.reporting.environment.config;

import org.springframework.context.ApplicationContextInitializer;
import org.springframework.context.ConfigurableApplicationContext;
import org.springframework.mock.env.MockEnvironment;

/**
 * Uses {@link MockEnvironment}, which supports setting environment property values at runtime.
 */
public class PropertyMockingApplicationContextInitializer
        implements ApplicationContextInitializer<ConfigurableApplicationContext> {

    @Override
    public void initialize(ConfigurableApplicationContext configurableApplicationContext) {
        MockEnvironment mockEnvironment = new MockEnvironment();
        configurableApplicationContext.setEnvironment(mockEnvironment);
    }
}
