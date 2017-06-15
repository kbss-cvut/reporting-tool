package cz.cvut.kbss.reporting.service.formgen;

import cz.cvut.kbss.reporting.factorgraph.FactorGraphNodeVisitor;
import cz.cvut.kbss.reporting.factorgraph.traversal.FactorGraphTraverser;
import cz.cvut.kbss.reporting.factorgraph.traversal.IdentityBasedFactorGraphTraverser;
import cz.cvut.kbss.reporting.model.Event;
import cz.cvut.kbss.reporting.model.Occurrence;
import cz.cvut.kbss.reporting.model.OccurrenceReport;
import cz.cvut.kbss.reporting.persistence.dao.formgen.FormGenDao;
import cz.cvut.kbss.reporting.persistence.dao.formgen.OccurrenceReportFormGenDao;
import cz.cvut.kbss.reporting.rest.util.RestUtils;
import cz.cvut.kbss.reporting.service.security.SecurityUtils;
import cz.cvut.kbss.reporting.util.Constants;
import cz.cvut.kbss.reporting.util.IdentificationUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.net.URI;
import java.util.Map;

@Component
public class EventFormGenDataProcessor extends FormGenDataProcessor<OccurrenceReport> {

    /**
     * Event URI parameter for the form generator.
     */
    static final String EVENT_PARAM = "event";

    private final OccurrenceReportFormGenDao dao;

    private final SecurityUtils securityUtils;

    @Autowired
    public EventFormGenDataProcessor(OccurrenceReportFormGenDao dao, SecurityUtils securityUtils) {
        this.dao = dao;
        this.securityUtils = securityUtils;
    }

    @Override
    FormGenDao<OccurrenceReport> getPrimaryDao() {
        return dao;
    }

    @Override
    public void process(OccurrenceReport data, Map<String, String> params) {
        final Integer referenceId = getReferenceId(params);
        prepareReportForPersist(data);
        super.process(data, params);
        if (referenceId == null) {
            return;
        }

        final SearchByReferenceVisitor visitor = new SearchByReferenceVisitor(referenceId);
        final FactorGraphTraverser traverser = new IdentityBasedFactorGraphTraverser(visitor, null);
        traverser.traverse(data.getOccurrence());
        if (visitor.uri == null) {
            throw new IllegalArgumentException(
                    "Event with reference id " + referenceId + " not found in the factor graph.");
        }
        this.params.put(EVENT_PARAM, RestUtils.encodeUrl(visitor.uri.toString()));
    }

    private Integer getReferenceId(Map<String, String> params) {
        if (!params.containsKey(EVENT_PARAM)) {
            return null;
        }
        final Integer referenceId;
        try {
            referenceId = Integer.parseInt(params.get(EVENT_PARAM));
        } catch (NumberFormatException e) {
            throw new IllegalArgumentException("Event reference id " + params.get(EVENT_PARAM) + " is not valid.");
        }
        return referenceId;
    }

    private void prepareReportForPersist(OccurrenceReport report) {
        if (report.getAuthor() == null) {
            report.setAuthor(securityUtils.getCurrentUser());
        }
        if (report.getCorrectiveMeasures() != null) {
            report.getCorrectiveMeasures().clear();
        }
        if (report.getRevision() == null) {
            report.setRevision(Constants.INITIAL_REVISION);
        }
        if (report.getFileNumber() == null) {
            report.setFileNumber(IdentificationUtils.generateFileNumber());
        }
    }

    private static final class SearchByReferenceVisitor implements FactorGraphNodeVisitor {

        private final Integer referenceId;
        private URI uri;

        private SearchByReferenceVisitor(Integer referenceId) {
            this.referenceId = referenceId;
        }

        @Override
        public void visit(Occurrence occurrence) {
            if (referenceId.equals(occurrence.getReferenceId())) {
                this.uri = occurrence.getUri();
            }
        }

        @Override
        public void visit(Event event) {
            if (referenceId.equals(event.getReferenceId())) {
                this.uri = event.getUri();
            }
        }
    }
}
