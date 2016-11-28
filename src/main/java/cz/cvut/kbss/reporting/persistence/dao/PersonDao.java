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

import cz.cvut.kbss.reporting.model.Person;
import cz.cvut.kbss.reporting.model.Vocabulary;
import cz.cvut.kbss.reporting.util.Constants;
import cz.cvut.kbss.jopa.exceptions.NoResultException;
import cz.cvut.kbss.jopa.model.EntityManager;
import org.springframework.stereotype.Repository;

import java.net.URI;

@Repository
public class PersonDao extends DerivableUriDao<Person> {

    public PersonDao() {
        super(Person.class);
    }

    public Person findByUsername(String username) {
        final EntityManager em = entityManager();
        try {
            return em.createNativeQuery(
                    "SELECT ?x WHERE { ?x ?hasUsername ?username . }", Person.class)
                     .setParameter("hasUsername", URI.create(Vocabulary.s_p_accountName))
                     .setParameter("username", username, Constants.PU_LANGUAGE)
                     .getSingleResult();
        } catch (NoResultException e) {
            return null;
        } finally {
            em.close();
        }
    }
}
