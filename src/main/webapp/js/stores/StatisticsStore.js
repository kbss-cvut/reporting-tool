'use strict';

var Reflux = require('reflux');

var Actions = require('../actions/Actions');
var Ajax = require('../utils/Ajax');
var Logger = require('../utils/Logger');

var BASE_URL = 'rest/statistics';

var StatisticsStore = Reflux.createStore({
    listenables: [Actions],
    _statistics: null,

    onLoadStatistics: function () {
        Ajax.get(BASE_URL).end(function (data) {
            this._reports = this.compute(data);
            this.trigger({
                action: Actions.loadStatistics,
                statistics: this._statistics
            });
        }.bind(this), function () {
            Logger.error('Unable to fetch statistics.');
            this.trigger({
                action: Actions.loadStatistics,
                statistics: []
            });
        }.bind(this));
    },

    compute: function (data) {
        // if (this.isMounted()) {
        Logger.log("Mounted, fetching setting new state...");

        var rows = [],
            dimensions = [],
            calculations, activeDimensions;
        for (var row in data.results.bindings) {
            var record = data.results.bindings[row];
            var newRecord = {};
            for (var col in record) {
                var val = record[col];
                newRecord[col] = val.value;
            }
            rows.push(newRecord);
        }

        Logger.log(JSON.stringify(rows, null, 2));

        for (var v in data.head.vars) {
            var vName = data.head.vars[v];
            if (!vName.startsWith('count'))
                dimensions.push({value: vName, title: vName.replace('_', ' ')});
        }

        activeDimensions = [dimensions[0]];

        calculations = [
            {
                title: 'count', value: 'count',
                template: function (val, row) {
                    Logger.log("val=" + val + ",row=" + row);
                    return val;
                }
            }
        ];

        this._statistics =
        {
            rows: rows,
            activeDimensions: activeDimensions,
            dimensions: dimensions,
            calculations: calculations,
            reportKey: Date.now()
        };
    }

});

module.exports = StatisticsStore;
