/*
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
'use strict';
// Have the imports here, so that the I18nStore is initialized before any of the components which might need it
import React from "react";
import {IndexRoute, Route, Router} from "react-router";
import {IntlProvider} from "react-intl";
import {history} from "./utils/Routing";
import Routes from "./utils/Routes";
import Actions from "./actions/Actions";
import Administration from "./components/admin/Administration";
import Login from "./components/login/Login";
import RegisterController from "./components/register/RegisterController";
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
                    <Route path={Routes.register.path} onEnter={onRouteEnter} component={RegisterController}/>
                    <Route path={Routes.dashboard.path} onEnter={onRouteEnter} component={DashboardController}/>
                    <Route path={Routes.reports.path} onEnter={onRouteEnter} component={ReportsController}/>
                    <Route path={Routes.statistics.path} onEnter={onRouteEnter} component={StatisticsController}/>
                    <Route path={Routes.createReport.path} onEnter={onRouteEnter} component={ReportDetailController}/>
                    <Route path={Routes.editReport.path} onEnter={onRouteEnter} component={ReportDetailController}/>
                    <Route path={Routes.searchResults.path} onEnter={onRouteEnter} component={SearchResultController}/>
                    <Route path={Routes.administration.path} onEnter={onRouteEnter} component={Administration}/>
                </Route>
            </Router>
        </IntlProvider>;
    }
}
