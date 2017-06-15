'use strict';

var Actions = require('../actions/Actions');
var Routes = require('./Routes');

var rules = {};

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
