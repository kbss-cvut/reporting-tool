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
package cz.cvut.kbss.reporting.model.util;

import java.net.URI;

/**
 * This is just a convenience interface which is implemented by all entities.
 * <p>
 * It simplifies testing, because we can reuse e.g. collection equality method, which goes over URIs instead of relying
 * on equals/hashCode being overridden.
 * <p>
 * In the future, this should be replaced by an abstract mapped superclass with an URI field representing the identifier
 * (as is usual in JPA models).
 */
public interface HasUri {

    URI getUri();
}
