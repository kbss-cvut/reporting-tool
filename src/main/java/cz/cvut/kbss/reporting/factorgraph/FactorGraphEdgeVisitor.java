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
package cz.cvut.kbss.reporting.factorgraph;

import java.net.URI;

/**
 * Visits edges during factor graph traversal.
 */
public interface FactorGraphEdgeVisitor {

    /**
     * Visits edge specified by its source, target and type.
     *
     * @param uri  URI of the edge (if present). Optional
     * @param from Edge source
     * @param to   Edge target
     * @param type Edge type
     */
    void visit(URI uri, URI from, URI to, URI type);
}
