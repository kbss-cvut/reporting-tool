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
package cz.cvut.kbss.reporting.service.repository;

import cz.cvut.kbss.reporting.model.Organization;
import cz.cvut.kbss.reporting.persistence.dao.GenericDao;
import cz.cvut.kbss.reporting.persistence.dao.OrganizationDao;
import cz.cvut.kbss.reporting.service.OrganizationService;
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
