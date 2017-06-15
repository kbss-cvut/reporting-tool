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

import cz.cvut.kbss.reporting.model.LogicalDocument;

import java.util.Comparator;

/**
 * Compares logical documents by date created and revision (if necessary). The resulting order is descending.
 */
public class DocumentDateAndRevisionComparator implements Comparator<LogicalDocument> {
    @Override
    public int compare(LogicalDocument a, LogicalDocument b) {
        int res;
        if (b.getDateCreated() == null && a.getDateCreated() == null) {
            res = 0;
        } else if (b.getDateCreated() == null && a.getDateCreated() != null) {
            res = -1;
        } else if (b.getDateCreated() != null && a.getDateCreated() == null) {
            res = 1;
        } else {
            res = b.getDateCreated().compareTo(a.getDateCreated());
        }
        if (res == 0) {
            res = b.getRevision().compareTo(a.getRevision());
        }
        return res;
    }
}
