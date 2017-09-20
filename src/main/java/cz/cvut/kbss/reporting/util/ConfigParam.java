/**
 * Copyright (C) 2017 Czech Technical University in Prague
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
package cz.cvut.kbss.reporting.util;

public enum ConfigParam {

    /**
     * URL of the main application repository.
     */
    REPOSITORY_URL("repositoryUrl"),
    /**
     * OntoDriver class for the repository.
     */
    DRIVER("driver"),
    /**
     * Repository from which options are loaded.
     */
    EVENT_TYPE_REPOSITORY_URL("eventTypesRepository"),
    /**
     * URL of Liferay portal.
     */
    PORTAL_URL("portalUrl"),
    /**
     * Repository into which data for form generation are persisted.
     */
    FORM_GEN_REPOSITORY_URL("formGenRepositoryUrl"),
    /**
     * URL of the form generator service.
     */
    FORM_GEN_SERVICE_URL("formGenServiceUrl"),
    /**
     * URL of the text analysis service.
     */
    TEXT_ANALYSIS_SERVICE_URL("textAnalysisServiceUrl"),
    /**
     * URLs of vocabularies used for text analysis, delimited by a comma (,).
     */
    TEXT_ANALYSIS_VOCABULARIES("text-analysis.vocabularies"),
    /**
     * Location where the hidden file containing admin credentials should be saved (only one time event).
     */
    ADMIN_CREDENTIALS_LOCATION("adminCredentialsFileLocation"),
    /**
     * Whether the maximum number of unsuccessful login attempts should be restricted, boolean value.
     */
    RESTRICT_LOGIN_ATTEMPTS("restrictLoginAttempts"),
    /**
     * index.html location, used by Portal authentication
     */
    INDEX_FILE("indexFile");

    private final String name;

    ConfigParam(String name) {
        this.name = name;
    }

    @Override
    public String toString() {
        return name;
    }
}
