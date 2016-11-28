/**
 * Copyright (C) 2016 Czech Technical University in Prague
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
