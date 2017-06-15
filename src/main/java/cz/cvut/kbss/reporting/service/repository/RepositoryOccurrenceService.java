package cz.cvut.kbss.reporting.service.repository;

import cz.cvut.kbss.reporting.model.Occurrence;
import cz.cvut.kbss.reporting.model.OccurrenceReport;
import cz.cvut.kbss.reporting.persistence.dao.OccurrenceDao;
import cz.cvut.kbss.reporting.persistence.dao.OccurrenceReportDao;
import cz.cvut.kbss.reporting.persistence.dao.OwlKeySupportingDao;
import cz.cvut.kbss.reporting.service.OccurrenceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Objects;

@Service
public class RepositoryOccurrenceService extends KeySupportingRepositoryService<Occurrence>
        implements OccurrenceService {

    @Autowired
    private OccurrenceDao occurrenceDao;

    @Autowired
    private OccurrenceReportDao reportDao;

    @Override
    protected OwlKeySupportingDao<Occurrence> getPrimaryDao() {
        return occurrenceDao;
    }

    @Override
    public OccurrenceReport findByOccurrence(Occurrence occurrence) {
        Objects.requireNonNull(occurrence);
        return reportDao.findByOccurrence(occurrence);
    }
}
