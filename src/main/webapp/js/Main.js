'use strict';
// Have the imports here, so that the I18nStore is initialized before any of the components which might need it
import React from "react";
import {IndexRoute, Route, Router} from "react-router";
import {IntlProvider} from "react-intl";
import {history} from "./utils/Routing";
import Routes from "./utils/Routes";
import Actions from "./actions/Actions";
import Login from "./components/login/Login";
import Register from "./components/register/Register";
import MainView from "./components/MainView";
import DashboardController from "./components/dashboard/DashboardController";
import ReportsController from "./components/report/ReportsController";
import StatisticsController from "./components/statistics/StatisticsController";
import ReportDetailController from "./components/report/ReportController";
import RoutingRules from "./utils/RoutingRules";
import SearchResultController from "./components/search/SearchResultController";

function onRouteEnter() {
    RoutingRules.execute(this.path);
}

// Wrapping router in a React component to allow Intl to initialize
export default class Main extends React.Component {
    static propTypes = {
        intlData: React.PropTypes.object
    };

    constructor(props) {
        super(props);
    }

    componentWillMount() {
        Actions.loadUser();
    }

    render() {
        return <IntlProvider {...this.props.intlData}>
            <Router history={history}>
                <Route path='/' component={MainView}>
                    <IndexRoute component={DashboardController}/>
                    <Route path={Routes.login.path} onEnter={onRouteEnter} component={Login}/>
                    <Route path={Routes.register.path} onEnter={onRouteEnter} component={Register}/>
                    <Route path={Routes.dashboard.path} onEnter={onRouteEnter} component={DashboardController}/>
                    <Route path={Routes.reports.path} onEnter={onRouteEnter} component={ReportsController}/>
                    <Route path={Routes.statistics.path} onEnter={onRouteEnter} component={StatisticsController}/>
                    <Route path={Routes.createReport.path} onEnter={onRouteEnter} component={ReportDetailController}/>
                    <Route path={Routes.editReport.path} onEnter={onRouteEnter} component={ReportDetailController}/>
                    <Route path={Routes.searchResults.path} onEnter={onRouteEnter} component={SearchResultController}/>
                </Route>
            </Router>
        </IntlProvider>;
    }
}