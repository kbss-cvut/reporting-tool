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
