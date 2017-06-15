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
package cz.cvut.kbss.reporting.environment.util;

import cz.cvut.kbss.reporting.model.LogicalDocument;

import java.util.Comparator;

/**
 * Compares two reports by their revision numbers, descending order.
 *
 * @param <T>
 */
public class ReportRevisionComparator<T extends LogicalDocument> implements Comparator<T> {

    @Override
    public int compare(T a, T b) {
        return b.getRevision().compareTo(a.getRevision());
    }
}
