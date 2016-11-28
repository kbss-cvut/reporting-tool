package cz.cvut.kbss.reporting.rest;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.access.prepost.PreAuthorize;

@PreAuthorize("hasRole('ROLE_USER')")
public class BaseController {

    protected static final Logger LOG = LoggerFactory.getLogger(BaseController.class);

}
