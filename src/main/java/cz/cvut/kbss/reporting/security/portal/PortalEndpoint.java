package cz.cvut.kbss.reporting.security.portal;

public abstract class PortalEndpoint {

    private static final String COMPANY_ID_PARAM = "companyId";

    private PortalEndpoint() {
    }

    public abstract String constructPath(String identification, String companyId);

    public static PortalEndpoint createEndpoint(PortalEndpointType type) {
        switch (type) {
            case EMAIL_ADDRESS:
                return new EmailAddressPortalEndpoint();
            case SCREEN_NAME:
                return new ScreenNamePortalEndpoint();
            case USER_ID:
                return new UserIdPortalEndpoint();
            default:
                throw new IllegalArgumentException("Unknown portal endpoint type.");
        }
    }

    private static class EmailAddressPortalEndpoint extends PortalEndpoint {

        private static final String PATH = "api/jsonws/user/get-user-by-email-address";
        private static final String PARAM = "emailAddress";

        @Override
        public String constructPath(String identification, String companyId) {
            return PATH + "?" + PARAM + "=" + identification + "&" + COMPANY_ID_PARAM + "=" + companyId;
        }
    }

    private static class ScreenNamePortalEndpoint extends PortalEndpoint {

        private static final String PATH = "api/jsonws/user/get-user-by-screen-name";
        private static final String PARAM = "screenName";

        @Override
        public String constructPath(String identification, String companyId) {
            return PATH + "?" + PARAM + "=" + identification + "&" + COMPANY_ID_PARAM + "=" + companyId;
        }
    }

    private static class UserIdPortalEndpoint extends PortalEndpoint {

        private static final String PATH = "api/jsonws/user/get-user-by-id";
        private static final String PARAM = "userId";

        @Override
        public String constructPath(String identification, String companyId) {
            return PATH + "?" + PARAM + "=" + identification;
        }
    }
}
