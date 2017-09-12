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

const hashHistory = require('react-router').hashHistory;

const Constants = require('../constants/Constants');
const RouterStore = require('../stores/RouterStore');
const RoutingRules = require('./RoutingRules');

const Routing = {
    history: hashHistory,

    originalTarget: null,

    /**
     * Transitions to the specified route
     * @param route Route object
     * @param options Transition options, can specify path parameters, query parameters, payload and view handlers.
     */
    transitionTo: function (route, options) {
        let path = route.path;
        if (!options) {
            options = {};
        }
        if (options.params) {
            path = this.setPathParams(path, options.params);
        }
        RouterStore.setTransitionPayload(route.name, options.payload);
        RouterStore.setViewHandlers(route.name, options.handlers);
        RoutingRules.execute(route.name);
        this.history.push({
            pathname: path,
            search: options.query
        });
    },

    setPathParams: function (path, params) {
        for (let paramName in params) {
            if (params.hasOwnProperty(paramName)) {
                path = path.replace(':' + paramName, params[paramName]);
            }
        }
        return path;
    },

    transitionToHome: function (options) {
        this.transitionTo(Constants.HOME_ROUTE, options);
    },

    saveOriginalTarget: function (route) {
        if (!route || route === '') {
            return;
        }
        this.originalTarget = route;
    },

    transitionToOriginalTarget: function () {
        if (this.originalTarget) {
            this.transitionTo(this.originalTarget);
        } else {
            this.transitionTo(Constants.HOME_ROUTE);
        }
    }
};

module.exports = Routing;
