package cz.cvut.kbss.reporting.dto.reportlist;

import java.util.ArrayList;
import java.util.Collection;

/**
 * Works around Java type erasure and the problems it causes to JSON serialization.
 */
public class ReportList extends ArrayList<ReportDto> {

    public ReportList() {
    }

    public ReportList(Collection<? extends ReportDto> c) {
        super(c);
    }
}
