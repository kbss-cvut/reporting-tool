'use strict';

import React from "react";
import Actions from "../../actions/Actions";
import Dashboard from "./Dashboard";
import I18nWrapper from "../../i18n/I18nWrapper";
import injectIntl from "../../utils/injectIntl";
import Routes from "../../utils/Routes";
import Routing from "../../utils/Routing";
import UserStore from "../../stores/UserStore";

class DashboardController extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            firstName: UserStore.getCurrentUser() ? UserStore.getCurrentUser().firstName : ''
        };
    }

    componentWillMount() {
        Actions.loadAllReports();
        this.unsubscribe = UserStore.listen(this.onUserLoaded);
    }

    componentWillUnmount() {
        this.unsubscribe();
    }

    onUserLoaded = (user) => {
        this.setState({firstName: user.firstName});
    };

    static createEmptyReport() {
        Routing.transitionTo(Routes.createReport, {
            handlers: {
                onSuccess: Routes.reports,
                onCancel: Routes.dashboard
            }
        });
    }

    static openReport(report) {
        Routing.transitionTo(Routes.editReport, {
            params: {reportKey: report.key},
            handlers: {onCancel: Routes.dashboard}
        });
    }

    static showReports() {
        Routing.transitionTo(Routes.reports);
    }

    static onImportFinish = (report) => {
        Routing.transitionTo(Routes.createReport, {
            payload: report,
            handlers: {
                onSuccess: Routes.reports,
                onCancel: Routes.dashboard
            }
        });
    };


    render() {
        return <div>
            <Dashboard userFirstName={this.state.firstName}
                       showAllReports={DashboardController.showReports}
                       createEmptyReport={DashboardController.createEmptyReport}
                       onImportFinish={DashboardController.onImportFinish}
                       openReport={DashboardController.openReport}/>
        </div>;
    }
}

export default injectIntl(I18nWrapper(DashboardController));
