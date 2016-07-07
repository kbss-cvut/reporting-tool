package cz.cvut.kbss.reporting.service.jmx;

import cz.cvut.kbss.reporting.service.event.InvalidateCacheEvent;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.context.ApplicationEventPublisherAware;
import org.springframework.jmx.export.annotation.ManagedOperation;
import org.springframework.jmx.export.annotation.ManagedResource;
import org.springframework.stereotype.Component;

@Component
@ManagedResource(objectName = "bean:name=INBASStageAdminBean", description = "Application administration bean. ")
public class AppAdminBean implements ApplicationEventPublisherAware {

    private ApplicationEventPublisher eventPublisher;

    @ManagedOperation(description = "Invalidates the application's caches.")
    public void invalidateCaches() {
        eventPublisher.publishEvent(new InvalidateCacheEvent(this));
    }

    @Override
    public void setApplicationEventPublisher(ApplicationEventPublisher applicationEventPublisher) {
        this.eventPublisher = applicationEventPublisher;
    }
}
