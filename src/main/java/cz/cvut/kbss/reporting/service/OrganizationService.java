package cz.cvut.kbss.reporting.service;

import cz.cvut.kbss.reporting.model.Organization;

public interface OrganizationService extends BaseService<Organization> {

    Organization findByName(String name);
}
