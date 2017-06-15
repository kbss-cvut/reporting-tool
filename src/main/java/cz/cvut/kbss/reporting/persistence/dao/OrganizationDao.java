package cz.cvut.kbss.reporting.persistence.dao;

import cz.cvut.kbss.jopa.exceptions.NoResultException;
import cz.cvut.kbss.jopa.model.EntityManager;
import cz.cvut.kbss.reporting.model.Organization;
import cz.cvut.kbss.reporting.model.Vocabulary;
import cz.cvut.kbss.reporting.util.Constants;
import org.springframework.stereotype.Repository;

import java.net.URI;

@Repository
public class OrganizationDao extends DerivableUriDao<Organization> {

    public OrganizationDao() {
        super(Organization.class);
    }

    /**
     * Gets organization with the specified name.
     *
     * @param name Organization name
     * @return Organization or {@code null}
     */
    public Organization findByName(String name) {
        if (name == null) {
            return null;
        }
        final EntityManager em = entityManager();
        try {
            return em.createNativeQuery("SELECT ?x WHERE { ?x ?hasName ?name . }", Organization.class)
                     .setParameter("hasName", URI.create(Vocabulary.s_p_label))
                     .setParameter("name", name, Constants.PU_LANGUAGE).getSingleResult();
        } catch (NoResultException e) {
            return null;
        } finally {
            em.close();
        }
    }
}
