package cz.cvut.kbss.reporting.security.portal;

public enum PortalEndpointType {
    EMAIL_ADDRESS("emailAddress"), SCREEN_NAME("screenName"), USER_ID("userId");

    private final String name;

    PortalEndpointType(String name) {
        this.name = name;
    }

    @Override
    public String toString() {
        return name;
    }

    public static PortalEndpointType fromString(String value) {
        for (PortalEndpointType type : values()) {
            if (type.name.equalsIgnoreCase(value)) {
                return type;
            }
        }
        throw new IllegalArgumentException("Unsupported portal endpoint type " + value);
    }
}
