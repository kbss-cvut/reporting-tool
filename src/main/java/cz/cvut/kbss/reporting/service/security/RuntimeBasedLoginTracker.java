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
package cz.cvut.kbss.reporting.service.security;

import cz.cvut.kbss.reporting.model.Person;
import cz.cvut.kbss.reporting.security.SecurityConstants;
import cz.cvut.kbss.reporting.service.event.LoginAttemptsThresholdExceeded;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.context.ApplicationEventPublisherAware;

import java.net.URI;
import java.util.Map;
import java.util.Objects;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicInteger;

/**
 * Tracks unsuccessful login attempts, but does not store the information in any persistent storage.
 * <p>
 * This means that when the application is shut down, the data about login attempts are lost.
 * <p>
 * When a threshold ({@link cz.cvut.kbss.reporting.security.SecurityConstants#MAX_LOGIN_ATTEMPTS}) is reached, an event
 * is published for the application. A successful login resets the counter of unsuccessful attempts for the user.
 */
public class RuntimeBasedLoginTracker implements LoginTracker, ApplicationEventPublisherAware {

    private ApplicationEventPublisher eventPublisher;

    private final Map<URI, AtomicInteger> counter = new ConcurrentHashMap<>();

    @Override
    public void unsuccessfulLoginAttempt(Person user) {
        Objects.requireNonNull(user);
        if (!counter.containsKey(user.getUri())) {
            counter.putIfAbsent(user.getUri(), new AtomicInteger());
        }
        final AtomicInteger cnt = counter.get(user.getUri());
        final int attempts = cnt.incrementAndGet();
        if (attempts > SecurityConstants.MAX_LOGIN_ATTEMPTS) {
            emitThresholdExceeded(user);
        }
    }

    private void emitThresholdExceeded(Person user) {
        if (counter.get(user.getUri()).get() > SecurityConstants.MAX_LOGIN_ATTEMPTS + 1) {
            // Do not emit multiple times
            return;
        }
        eventPublisher.publishEvent(new LoginAttemptsThresholdExceeded(this, user));
    }

    @Override
    public void successfulLoginAttempt(Person user) {
        Objects.requireNonNull(user);
        counter.computeIfPresent(user.getUri(), (uri, attempts) -> {
            attempts.set(0);
            return attempts;
        });
    }

    @Override
    public void setApplicationEventPublisher(ApplicationEventPublisher eventPublisher) {
        this.eventPublisher = eventPublisher;
    }
}
