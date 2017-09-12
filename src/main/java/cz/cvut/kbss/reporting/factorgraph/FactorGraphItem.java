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

import cz.cvut.kbss.reporting.model.Event;
import cz.cvut.kbss.reporting.model.Factor;
import cz.cvut.kbss.reporting.model.util.HasUri;

import java.util.Set;

/**
 * Marker interface for classes used in factor graphs.
 */
public interface FactorGraphItem extends HasUri {

    Set<Event> getChildren();

    void setChildren(Set<Event> children);

    void addChild(Event child);

    Set<Factor> getFactors();

    void setFactors(Set<Factor> factors);

    void addFactor(Factor factor);

    void accept(FactorGraphNodeVisitor visitor);
}
