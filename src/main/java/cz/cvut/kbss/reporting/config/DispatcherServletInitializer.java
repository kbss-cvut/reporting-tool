/**
 * Copyright (C) 2016 Czech Technical University in Prague
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
package cz.cvut.kbss.reporting.config;

import cz.cvut.kbss.reporting.security.SecurityConstants;
import cz.cvut.kbss.reporting.util.Constants;
import org.springframework.web.context.request.RequestContextListener;
import org.springframework.web.filter.DelegatingFilterProxy;
import org.springframework.web.servlet.support.AbstractAnnotationConfigDispatcherServletInitializer;

import javax.servlet.*;
import java.util.EnumSet;

public class DispatcherServletInitializer extends AbstractAnnotationConfigDispatcherServletInitializer {

    @Override
    protected Class<?>[] getRootConfigClasses() {
        return new Class<?>[]{AppConfig.class};
    }

    @Override
    protected Class<?>[] getServletConfigClasses() {
        return null;
    }

    @Override
    protected String[] getServletMappings() {
        return new String[]{"/rest/*"};
    }

    @Override
    public void onStartup(ServletContext servletContext) throws ServletException {
        System.out.println("****** Application Context Initialization ******");

        initSecurityFilter(servletContext);
        servletContext.addListener(new RequestContextListener());
        servletContext.getSessionCookieConfig().setName(SecurityConstants.SESSION_COOKIE_NAME);
        super.onStartup(servletContext);
    }

    private void initSecurityFilter(ServletContext servletContext) {
        FilterRegistration.Dynamic securityFilter = servletContext.addFilter("springSecurityFilterChain",
                DelegatingFilterProxy.class);
        final EnumSet<DispatcherType> es = EnumSet.of(DispatcherType.REQUEST, DispatcherType.FORWARD);
        securityFilter.addMappingForUrlPatterns(es, true, "/*");
    }

    @Override
    protected void customizeRegistration(ServletRegistration.Dynamic registration) {
        registration.setMultipartConfig(getMultipartConfigElement());
    }

    /**
     * Configures multipart processing (for uploaded files).
     */
    private MultipartConfigElement getMultipartConfigElement() {
        return new MultipartConfigElement(Constants.UPLOADED_FILE_LOCATION, Constants.MAX_UPLOADED_FILE_SIZE,
                Constants.MAX_UPLOAD_REQUEST_SIZE, Constants.UPLOADED_FILE_SIZE_THRESHOLD);
    }
}
