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
