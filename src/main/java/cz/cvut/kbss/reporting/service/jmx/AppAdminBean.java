package cz.cvut.kbss.reporting.service.jmx;

import cz.cvut.kbss.jopa.model.EntityManagerFactory;
import cz.cvut.kbss.reporting.service.event.InvalidateCacheEvent;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.context.ApplicationEventPublisherAware;
import org.springframework.jmx.export.annotation.ManagedOperation;
import org.springframework.jmx.export.annotation.ManagedResource;
import org.springframework.stereotype.Component;

@Component
@ManagedResource(objectName = "bean:name=INBASAdminBean", description = "Application administration bean. ")
public class AppAdminBean implements ApplicationEventPublisherAware {

    private ApplicationEventPublisher eventPublisher;

    private EntityManagerFactory emf;

    @Autowired
    public AppAdminBean(EntityManagerFactory emf) {
        this.emf = emf;
    }

    @ManagedOperation(description = "Invalidates the application's caches.")
    public void invalidateCaches() {
        eventPublisher.publishEvent(new InvalidateCacheEvent(this));
        emf.getCache().evictAll();
    }

    @Override
    public void setApplicationEventPublisher(ApplicationEventPublisher applicationEventPublisher) {
        this.eventPublisher = applicationEventPublisher;
    }
}
