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
package cz.cvut.kbss.reporting.model.util;

import cz.cvut.kbss.reporting.model.Event;

import java.util.Comparator;

/**
 * For event children sorting.
 */
public class EventPositionComparator implements Comparator<Event> {

    @Override
    public int compare(Event a, Event b) {
        if (a.getIndex() != null && b.getIndex() != null) {
            return a.getIndex().compareTo(b.getIndex());
        }
        // If either index is missing, do not use it at all. It could break sorted set equals/hashCode contract
        return a.hashCode() - b.hashCode();
    }
}
