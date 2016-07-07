/*
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
