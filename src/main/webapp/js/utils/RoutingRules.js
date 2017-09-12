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

const Actions = require('../actions/Actions');
const Routes = require('./Routes');

const rules = {};

/**
 * Rules for each route is just an array of functions, that should be executed.
 */

rules[Routes.dashboard.name] = [
    () => {
        Actions.resetComponentState(require('../components/report/ReportsController').displayName);
        // InjectIntl workaround
        Actions.resetComponentState(require('../components/report/ReportsTable').WrappedComponent.displayName);
    }
];

rules[Routes.statistics.name] = [
    () => {
        Actions.resetComponentState(require('../components/report/ReportsController').displayName);
        // InjectIntl workaround
        Actions.resetComponentState(require('../components/report/ReportsTable').WrappedComponent.displayName);
    }
];

/**
 * Defines rules executed during routing transformation.
 *
 * I.e. when the application transitions from one route to another, a rule can specify additional behaviour for the
 * application.
 * @type {{execute: module.exports.execute}}
 */
module.exports = {

    /**
     * Executes rules defined for the specified route name.
     * @param routeName Route name
     */
    execute: function (routeName) {
        if (rules[routeName]) {
            rules[routeName].forEach((item) => {
                item.call();
            });
        }
    }
};
