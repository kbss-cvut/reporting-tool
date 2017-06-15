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
package cz.cvut.kbss.reporting.factorgraph;

import cz.cvut.kbss.reporting.model.Event;
import cz.cvut.kbss.reporting.model.Occurrence;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;

/**
 * Sets event children indexes so that they represent a sequence without any gaps.
 */
public class EventChildIndexer implements FactorGraphNodeVisitor {

    @Override
    public void visit(Occurrence occurrence) {
        if (occurrence.getChildren() != null) {
            computeIndexes(occurrence.getChildren());
        }
    }

    @Override
    public void visit(Event event) {
        if (event.getChildren() != null) {
            computeIndexes(event.getChildren());
        }
    }

    private void computeIndexes(Set<Event> children) {
        final List<Event> indexed = new ArrayList<>(children);
        indexed.sort(null);
        int index = 0;
        for (Event evt : indexed) {
            evt.setIndex(index);
            index++;
        }
    }
}
