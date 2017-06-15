package cz.cvut.kbss.reporting.persistence.dao;

import cz.cvut.kbss.jopa.model.EntityManager;
import cz.cvut.kbss.jopa.model.EntityManagerFactory;
import cz.cvut.kbss.reporting.dto.ReportRevisionInfo;
import cz.cvut.kbss.reporting.model.Vocabulary;
import cz.cvut.kbss.reporting.util.Constants;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.net.URI;
import java.util.*;

/**
 * Helper DAO for getting various information about reports, without prior knowledge about what kind of report it may
 * be.
 */
@Repository
public class ReportDao {

    @Autowired
    private EntityManagerFactory emf;

    /**
     * Gets a set of OWL classes to which report with the specified key belongs.
     *
     * @param key Report identifier (key)
     * @return Report's classes, or an empty set, if there is no such report
     */
    public Set<String> getReportTypes(String key) {
        final EntityManager em = entityManager();
        try {
            final List<String> types = em
                    .createNativeQuery("SELECT ?type WHERE { ?x a ?type ; ?hasKey ?key . }", String.class)
                    .setParameter("hasKey", URI.create(Vocabulary.s_p_has_key))
                    .setParameter("key", key, Constants.PU_LANGUAGE)
                    .getResultList();
            return new HashSet<>(types);
        } finally {
            em.close();
        }
    }

    /**
     * Gets a set of OWL classes to which report with the specified URI belongs.
     *
     * @param uri Report identifier (URI)
     * @return Report's classes, or an empty set, if there is no such report
     */
    public Set<String> getReportTypes(URI uri) {
        final EntityManager em = entityManager();
        try {
            final List<String> types = em.createNativeQuery("SELECT ?type WHERE { ?x a ?type . }", String.class)
                                         .setParameter("x", uri).getResultList();
            return new HashSet<>(types);
        } finally {
            em.close();
        }
    }

    /**
     * Gets a set of OWL Classes to which reports in report chain with the specified identifier belong.
     * <p>
     * The result contains types of all reports in the chain, although it is expected that all the reports will have the
     * same set of types.
     *
     * @param fileNumber Report chain identifier
     * @return Report chain's classes or an empty set, if there is no such chain
     */
    public Set<String> getChainTypes(Long fileNumber) {
        final EntityManager em = entityManager();
        try {
            final List<String> types = em
                    .createNativeQuery("SELECT DISTINCT ?type WHERE { ?x a ?type ; ?hasFileNumber ?fileNo . }",
                            String.class).setParameter("hasFileNumber", URI.create(Vocabulary.s_p_has_file_number))
                    .setParameter("fileNo", fileNumber).getResultList();
            return new HashSet<>(types);
        } finally {
            em.close();
        }
    }

    /**
     * Gets a list of revision info instances for a report chain identified by the specified file number.
     *
     * @param fileNumber Report chain identifier
     * @return List of revision infos, ordered by revision number (descending)
     */
    public List<ReportRevisionInfo> getReportChainRevisions(Long fileNumber) {
        Objects.requireNonNull(fileNumber);
        final EntityManager em = entityManager();
        try {
            final List rows = em.createNativeQuery(
                    "SELECT ?x ?revision ?key ?created WHERE { ?x a ?type ;" +
                            "?hasRevision ?revision ; " +
                            "?wasCreated ?created ;" +
                            "?hasFileNumber ?fileNo ;" +
                            "?hasKey ?key ." +
                            "} ORDER BY DESC(?revision)")
                                .setParameter("type", URI.create(Vocabulary.s_c_report))
                                .setParameter("hasRevision", URI.create(Vocabulary.s_p_has_revision))
                                .setParameter("wasCreated", URI.create(Vocabulary.s_p_created))
                                .setParameter("hasKey", URI.create(Vocabulary.s_p_has_key))
                                .setParameter("hasFileNumber", URI.create(Vocabulary.s_p_has_file_number))
                                .setParameter("fileNo", fileNumber)
                                .getResultList();
            final List<ReportRevisionInfo> result = new ArrayList<>(rows.size());
            for (Object row : rows) {
                final Object[] rowArr = (Object[]) row;
                final ReportRevisionInfo info = new ReportRevisionInfo();
                info.setUri((URI) rowArr[0]);
                info.setRevision((Integer) rowArr[1]);
                info.setKey((String) rowArr[2]);
                info.setCreated((Date) rowArr[3]);
                result.add(info);
            }
            return result;
        } finally {
            em.close();
        }
    }

    private EntityManager entityManager() {
        return emf.createEntityManager();
    }
}
