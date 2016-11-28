package cz.cvut.kbss.reporting.security;

import javax.servlet.annotation.WebListener;
import javax.servlet.http.HttpSessionEvent;
import javax.servlet.http.HttpSessionListener;

/**
 * @author ledvima1
 */
@WebListener
public class SessionTimeoutManager implements HttpSessionListener {

    @Override
    public void sessionCreated(HttpSessionEvent httpSessionEvent) {
        httpSessionEvent.getSession().setMaxInactiveInterval(SecurityConstants.SESSION_TIMEOUT);
    }

    @Override
    public void sessionDestroyed(HttpSessionEvent httpSessionEvent) {
        // do nothing
    }
}
