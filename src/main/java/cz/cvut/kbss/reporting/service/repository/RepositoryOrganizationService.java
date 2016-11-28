package cz.cvut.kbss.reporting.service.repository;

import cz.cvut.kbss.inbas.reporting.model.Organization;
import cz.cvut.kbss.inbas.reporting.persistence.dao.GenericDao;
import cz.cvut.kbss.inbas.reporting.persistence.dao.OrganizationDao;
import cz.cvut.kbss.inbas.reporting.service.OrganizationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class RepositoryOrganizationService extends BaseRepositoryService<Organization> implements OrganizationService {

    @Autowired
    private OrganizationDao organizationDao;

    @Override
    protected GenericDao<Organization> getPrimaryDao() {
        return organizationDao;
    }

    @Override
    public Organization findByName(String name) {
        return organizationDao.findByName(name);
    }
}
