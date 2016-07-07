package cz.cvut.kbss.reporting.util;

public enum ConfigParam {

    REPOSITORY_URL("repositoryUrl"),
    DRIVER("driver"),
    EVENT_TYPE_REPOSITORY_URL("eventTypesRepository"),
    PORTAL_URL("portalUrl"),
    FORM_GEN_REPOSITORY_URL("formGenRepositoryUrl"),
    FORM_GEN_SERVICE_URL("formGenServiceUrl"),

    INDEX_FILE("indexFile");    // index.html location, used by Portal authentication

    private final String name;

    ConfigParam(String name) {
        this.name = name;
    }

    @Override
    public String toString() {
        return name;
    }
}
