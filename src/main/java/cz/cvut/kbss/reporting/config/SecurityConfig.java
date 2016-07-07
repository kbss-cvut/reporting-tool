package cz.cvut.kbss.reporting.config;

import cz.cvut.kbss.reporting.security.SecurityConstants;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.security.web.authentication.AuthenticationFailureHandler;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.security.web.authentication.logout.LogoutSuccessHandler;

@Configuration
@EnableWebSecurity
@ComponentScan(basePackages = "cz.cvut.kbss.reporting.security")
@EnableGlobalMethodSecurity(prePostEnabled = true, securedEnabled = true)
public class SecurityConfig extends WebSecurityConfigurerAdapter {

    private static final String[] COOKIES_TO_DESTROY = {
            SecurityConstants.SESSION_COOKIE_NAME,
            SecurityConstants.REMEMBER_ME_COOKIE_NAME,
            SecurityConstants.CSRF_COOKIE_NAME
    };

    @Autowired
    private AuthenticationEntryPoint authenticationEntryPoint;

    @Autowired
    private AuthenticationFailureHandler authenticationFailureHandler;

    @Autowired
    private AuthenticationSuccessHandler authenticationSuccessHandler;

    @Autowired
    private LogoutSuccessHandler logoutSuccessHandler;

    @Autowired
    @Qualifier("ontologyAuthenticationProvider")
    private AuthenticationProvider ontologyAuthenticationProvider;

    @Autowired
    @Qualifier("portalAuthenticationProvider")
    private AuthenticationProvider portalAuthenticationProvider;

    @Override
    protected void configure(AuthenticationManagerBuilder auth) throws Exception {
        auth.authenticationProvider(ontologyAuthenticationProvider)
            .authenticationProvider(portalAuthenticationProvider);
    }

    @Bean
    @Override
    public AuthenticationManager authenticationManagerBean() throws Exception {
        return super.authenticationManagerBean();
    }

    @Override
    protected void configure(HttpSecurity http) throws Exception {
        http.authorizeRequests().anyRequest().permitAll().and()
            .exceptionHandling().authenticationEntryPoint(authenticationEntryPoint)
            .and().headers().frameOptions().sameOrigin()
            .and()
            .authenticationProvider(portalAuthenticationProvider)
            .authenticationProvider(ontologyAuthenticationProvider)
//            .addFilterAfter(new CsrfHeaderFilter(), CsrfFilter.class)
            .csrf().disable()
            .formLogin().successHandler(authenticationSuccessHandler)
            .failureHandler(authenticationFailureHandler)
            .loginProcessingUrl(SecurityConstants.SECURITY_CHECK_URI)
            .usernameParameter(SecurityConstants.USERNAME_PARAM).passwordParameter(SecurityConstants.PASSWORD_PARAM)
            .and()
            .logout().invalidateHttpSession(true).deleteCookies(COOKIES_TO_DESTROY)
            .logoutUrl(SecurityConstants.LOGOUT_URI).logoutSuccessHandler(logoutSuccessHandler)
            .and().sessionManagement().maximumSessions(1);
    }
}
