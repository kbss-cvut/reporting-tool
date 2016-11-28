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

import cz.cvut.kbss.reporting.model.Event;
import cz.cvut.kbss.jopa.model.EntityManager;
import cz.cvut.kbss.jopa.model.EntityManagerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.net.URI;
import java.util.Objects;

/**
 * Data access object for reading events from the storage.
 * <p>
 * Only find by URI is supported.
 */
@Repository
public class EventDao {

    @Autowired
    private EntityManagerFactory emf;

    public Event find(URI uri) {
        Objects.requireNonNull(uri);
        final EntityManager em = emf.createEntityManager();
        try {
            return em.find(Event.class, uri);
        } finally {
            em.close();
        }
    }
}
