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
