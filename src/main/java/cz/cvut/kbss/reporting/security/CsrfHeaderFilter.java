package cz.cvut.kbss.reporting.security;

import org.springframework.security.web.csrf.CsrfToken;
import org.springframework.web.filter.OncePerRequestFilter;
import org.springframework.web.util.WebUtils;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

/**
 * Adds a CSRF token cookie to the response.
 * <p>
 * The cookie is then used by the client side to add a CSRF token to all subsequent request headers.
 *
 * @author ledvima1
 */
public class CsrfHeaderFilter extends OncePerRequestFilter {

    @Override
    protected void doFilterInternal(HttpServletRequest httpServletRequest, HttpServletResponse httpServletResponse,
                                    FilterChain filterChain) throws ServletException, IOException {
        CsrfToken csrfToken = (CsrfToken) httpServletRequest.getAttribute(CsrfToken.class.getName());
        if (csrfToken != null) {
            Cookie cookie = WebUtils.getCookie(httpServletRequest, SecurityConstants.CSRF_COOKIE_NAME);
            String token = csrfToken.getToken();
            if (cookie == null || token != null && !token.equals(cookie.getValue())) {
                cookie = new Cookie(SecurityConstants.CSRF_COOKIE_NAME, token);
                cookie.setPath(SecurityConstants.COOKIE_URI);
                httpServletResponse.addCookie(cookie);
            }
        }
        filterChain.doFilter(httpServletRequest, httpServletResponse);
    }
}
