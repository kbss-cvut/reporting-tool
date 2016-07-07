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
var Utils = require('../utils/Utils');

var BASE_URL = 'rest/reports';
var BASE_URL_WITH_SLASH = 'rest/reports/';

// When reports are being loaded, do not send the request again
var reportsLoading = false;

var ReportStore = Reflux.createStore({
    listenables: [Actions],

    _reports: null,

    onLoadAllReports: function () {
        if (reportsLoading) {
            return;
        }
        reportsLoading = true;
        Ajax.get(BASE_URL).end(function (data) {
            reportsLoading = false;
            this._reports = data;
            this.trigger({
                action: Actions.loadAllReports,
                reports: this._reports
            });
        }.bind(this), function () {
            reportsLoading = false;
            this.trigger({
                action: Actions.loadAllReports,
                reports: []
            });
        }.bind(this));
    },

    onLoadReport: function (key) {
        Ajax.get(BASE_URL_WITH_SLASH + key).end(function (data) {
            this.trigger({
                action: Actions.loadReport,
                report: data
            });
        }.bind(this), function () {
            this.trigger({
                action: Actions.loadReport,
                report: null
            });
        }.bind(this));
    },

    onLoadRevisions: function (fileNumber) {
        Ajax.get(BASE_URL_WITH_SLASH + 'chain/' + fileNumber + '/revisions').end(function (data) {
            this.trigger({
                action: Actions.loadRevisions,
                revisions: data
            });
        }.bind(this));
    },

    onCreateReport: function (report, onSuccess, onError) {
        Ajax.post(BASE_URL, report).end(function (data, resp) {
            if (onSuccess) {
                var key = Utils.extractKeyFromLocationHeader(resp);
                onSuccess(key);
            }
            this.onLoadAllReports();
        }.bind(this), onError);
    },

    onUpdateReport: function (report, onSuccess, onError) {
        Ajax.put(BASE_URL_WITH_SLASH + report.key).send(report).end(onSuccess, onError);
    },

    onSubmitReport: function (report, onSuccess, onError) {
        Ajax.post(BASE_URL_WITH_SLASH + 'chain/' + report.fileNumber + '/revisions').end(function (data, resp) {
            if (onSuccess) {
                var key = Utils.extractKeyFromLocationHeader(resp);
                onSuccess(key);
            }
        }, onError);
    },

    onPhaseTransition: function (report, onSuccess, onError) {
        Ajax.put(BASE_URL_WITH_SLASH + report.key + '/phase').end(onSuccess, onError);
    },

    onDeleteReportChain: function (fileNumber, onSuccess, onError) {
        Ajax.del(BASE_URL_WITH_SLASH + 'chain/' + fileNumber).end(function () {
            if (onSuccess) {
                onSuccess();
            }
            this.onLoadAllReports();
        }.bind(this), onError);
    },

    getReports: function () {
        return this._reports;
    }
});

module.exports = ReportStore;
