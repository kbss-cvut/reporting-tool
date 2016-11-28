package cz.cvut.kbss.reporting.service.repository;

import cz.cvut.kbss.reporting.exception.NotFoundException;
import cz.cvut.kbss.reporting.model.Occurrence;
import cz.cvut.kbss.reporting.model.OccurrenceReport;
import cz.cvut.kbss.reporting.model.util.factorgraph.traversal.FactorGraphTraverser;
import cz.cvut.kbss.reporting.model.util.factorgraph.traversal.IdentityBasedFactorGraphTraverser;
import cz.cvut.kbss.reporting.persistence.dao.OccurrenceReportDao;
import cz.cvut.kbss.reporting.persistence.dao.OwlKeySupportingDao;
import cz.cvut.kbss.reporting.service.OccurrenceReportService;
import cz.cvut.kbss.reporting.service.options.ReportingPhaseService;
import cz.cvut.kbss.reporting.service.security.SecurityUtils;
import cz.cvut.kbss.reporting.service.validation.OccurrenceReportValidator;
import cz.cvut.kbss.reporting.service.visitor.EventTypeSynchronizer;
import cz.cvut.kbss.reporting.util.Constants;
import cz.cvut.kbss.reporting.util.IdentificationUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.Objects;

@Service
public class RepositoryOccurrenceReportService extends KeySupportingRepositoryService<OccurrenceReport>
        implements OccurrenceReportService {

    @Autowired
    private OccurrenceReportDao reportDao;

    @Autowired
    private SecurityUtils securityUtils;

    @Autowired
    private OccurrenceReportValidator validator;

    @Autowired
    private ReportingPhaseService phaseService;

    @Autowired
    private EventTypeSynchronizer eventTypeSynchronizer;

    @Override
    protected OwlKeySupportingDao<OccurrenceReport> getPrimaryDao() {
        return reportDao;
    }

    @Override
    protected void prePersist(OccurrenceReport instance) {
        initReportData(instance);
        synchronizeEventTypes(instance.getOccurrence());
    }

    private void initReportData(OccurrenceReport instance) {
        instance.setAuthor(securityUtils.getCurrentUser());
        instance.setDateCreated(new Date());
        instance.setFileNumber(IdentificationUtils.generateFileNumber());
        instance.setRevision(Constants.INITIAL_REVISION);
        if (instance.getPhase() == null) {
            instance.setPhase(phaseService.getDefaultPhase());
        }
    }

    @Override
    protected void preUpdate(OccurrenceReport instance) {
        instance.setLastModifiedBy(securityUtils.getCurrentUser());
        instance.setLastModified(new Date());
        synchronizeEventTypes(instance.getOccurrence());
        validator.validateForUpdate(instance, find(instance.getUri()));
    }

    private void synchronizeEventTypes(Occurrence occurrence) {
        final FactorGraphTraverser traverser = new IdentityBasedFactorGraphTraverser(eventTypeSynchronizer, null);
        traverser.traverse(occurrence);
    }

    @Override
    protected void postLoad(OccurrenceReport instance) {
        if (instance != null) {
            instance.getAuthor().erasePassword();
            if (instance.getLastModifiedBy() != null) {
                instance.getLastModifiedBy().erasePassword();
            }
        }
    }

    @Override
    public OccurrenceReport createNewRevision(Long fileNumber) {
        final OccurrenceReport latest = findLatestRevision(fileNumber);
        if (latest == null) {
            throw NotFoundException.create("OccurrenceReport", fileNumber);
        }
        final OccurrenceReport newRevision = new OccurrenceReport(latest);
        newRevision.setRevision(latest.getRevision() + 1);
        newRevision.setAuthor(securityUtils.getCurrentUser());
        newRevision.setDateCreated(new Date());
        reportDao.persist(newRevision);
        return newRevision;
    }

    @Override
    public OccurrenceReport findLatestRevision(Long fileNumber) {
        Objects.requireNonNull(fileNumber);
        return reportDao.findLatestRevision(fileNumber);
    }

    @Override
    public OccurrenceReport findRevision(Long fileNumber, Integer revision) {
        Objects.requireNonNull(fileNumber);
        Objects.requireNonNull(revision);
        return reportDao.findRevision(fileNumber, revision);
    }

    @Override
    public void transitionToNextPhase(OccurrenceReport report) {
        Objects.requireNonNull(report);
        report.setPhase(phaseService.nextPhase(report.getPhase()));
        update(report);
    }

    @Override
    public void removeReportChain(Long fileNumber) {
        Objects.requireNonNull(fileNumber);
        reportDao.removeReportChain(fileNumber);
    }
}
