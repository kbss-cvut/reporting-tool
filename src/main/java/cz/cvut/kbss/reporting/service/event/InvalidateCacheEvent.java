package cz.cvut.kbss.reporting.service.event;

import org.springframework.context.ApplicationEvent;

/**
 * Event fired when the application cache(s) should be invalidated.
 */
public class InvalidateCacheEvent extends ApplicationEvent {

    public InvalidateCacheEvent(Object source) {
        super(source);
    }
}
