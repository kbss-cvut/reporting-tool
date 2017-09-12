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
package cz.cvut.kbss.reporting.persistence.dao;

import cz.cvut.kbss.jopa.model.EntityManager;
import cz.cvut.kbss.reporting.model.util.HasDerivableUri;

/**
 * Data access object for classes with derivable URI.
 * <p>
 * Makes sure that the URI is generated before the instance is persisted.
 *
 * @param <T> Entity type managed by this DAO
 */
abstract class DerivableUriDao<T extends HasDerivableUri> extends BaseDao<T> {

    protected DerivableUriDao(Class<T> type) {
        super(type);
    }

    /**
     * Generates URI and then calls persist.
     *
     * @param entity Entity to persist
     * @param em     Current entity manager
     */
    @Override
    protected void persist(T entity, EntityManager em) {
        assert entity != null;
        entity.generateUri();
        super.persist(entity, em);
    }
}
