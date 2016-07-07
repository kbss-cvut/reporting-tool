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
package cz.cvut.kbss.reporting.persistence.dao;

import cz.cvut.kbss.reporting.model.Organization;
import cz.cvut.kbss.reporting.model.Vocabulary;
import cz.cvut.kbss.reporting.util.Constants;
import cz.cvut.kbss.jopa.exceptions.NoResultException;
import cz.cvut.kbss.jopa.model.EntityManager;
import org.springframework.stereotype.Repository;

import java.net.URI;

@Repository
public class OrganizationDao extends DerivableUriDao<Organization> {

    public OrganizationDao() {
        super(Organization.class);
    }

    /**
     * Gets organization with the specified name.
     *
     * @param name Organization name
     * @return Organization or {@code null}
     */
    public Organization findByName(String name) {
        if (name == null) {
            return null;
        }
        final EntityManager em = entityManager();
        try {
            return em.createNativeQuery("SELECT ?x WHERE { ?x ?hasName ?name . }", Organization.class)
                     .setParameter("hasName", URI.create(Vocabulary.s_p_label))
                     .setParameter("name", name, Constants.PU_LANGUAGE).getSingleResult();
        } catch (NoResultException e) {
            return null;
        } finally {
            em.close();
        }
    }
}
