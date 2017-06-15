package cz.cvut.kbss.reporting.rest.dto.mapper;

import cz.cvut.kbss.reporting.model.Organization;
import cz.cvut.kbss.reporting.service.OrganizationService;
import org.mapstruct.TargetType;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ReferenceMapper {

    @Autowired
    private OrganizationService organizationService;

    public Organization resolve(String name, @TargetType Class<Organization> entityClass) {
        if (name == null) {
            return null;
        }
        final Organization org = organizationService.findByName(name);
        return org != null ? org : new Organization(name);
    }
}
