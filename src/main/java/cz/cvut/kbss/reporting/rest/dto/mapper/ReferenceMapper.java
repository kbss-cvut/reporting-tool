/**
 * Copyright (C) 2017 Czech Technical University in Prague
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
