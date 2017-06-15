'use strict';

const Reflux = require('reflux');

const Actions = require('../actions/Actions');
const Ajax = require('../utils/Ajax');
const Logger = require('../utils/Logger');
const Utils = require('../utils/Utils');

const BASE_URL = 'rest/statistics';

const StatisticsStore = Reflux.createStore({
    listenables: [Actions],

    onLoadStatistics: function (queryName, params) {
        const url = Utils.addParametersToUrl(BASE_URL+"/"+queryName, params)
        Ajax.get(url).end(function (data) {
            this.trigger({
                action: Actions.loadStatistics,
                queryName: queryName,
                params: params,
                queryResults: data
            });
        }.bind(this), function () {
            Logger.error('Unable to fetch statistics.');
            this.trigger({
                action: Actions.loadStatistics,
                queryName: queryName,
                params: params,
                queryResults: []
            });
        }.bind(this));
    }
});

module.exports = StatisticsStore;