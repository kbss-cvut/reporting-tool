package cz.cvut.kbss.reporting.security.portal;

import cz.cvut.kbss.reporting.model.Person;
import cz.cvut.kbss.reporting.rest.dto.model.PortalUser;
import cz.cvut.kbss.reporting.security.model.UserDetails;
import org.springframework.security.core.authority.SimpleGrantedAuthority;

public class PortalUserDetails extends UserDetails {

    public PortalUserDetails(Person person) {
        super(person);
        addPortalUserRole();
    }

    private void addPortalUserRole() {
        this.authorities.add(new SimpleGrantedAuthority(PortalUser.PORTAL_USER_ROLE));
    }
}
