'use strict';

const Reflux = require('reflux');

const Actions = require('../actions/Actions');
let Ajax = require('../utils/Ajax');
const Constants = require('../constants/Constants');
const JsonReferenceResolver = require('../utils/JsonReferenceResolver').default;
const Utils = require('../utils/Utils');

const BASE_URL = 'rest/reports';
const BASE_URL_WITH_SLASH = 'rest/reports/';

// When reports are being loaded, do not send the request again
let reportsLoading = false;
// Was the last report load filtered by report keys
let lastLoadWithKeys = false;

const ReportStore = Reflux.createStore({
    listenables: [Actions],

    _reports: null,
    _searchReports: null,
    _pendingLoad: null,

    _resetPendingLoad: function () {
        this._pendingLoad = null;
    },

    onLoadAllReports: function (keys = []) {
        if (reportsLoading) {
            return;
        }
        reportsLoading = true;
        lastLoadWithKeys = keys.length !== 0;
        Ajax.get(this._initLoadUri(keys)).end((data) => {
            reportsLoading = false;
            this._reports = data;
            if (!lastLoadWithKeys) {
                this._searchReports = this._reports;
                this.trigger({
                    action: Actions.loadReportsForSearch,
                    reports: this._searchReports
                });
            }
            this.trigger({
                action: Actions.loadAllReports,
                reports: this._reports
            });
        }, () => {
            reportsLoading = false;
            this.trigger({
                action: Actions.loadAllReports,
                reports: []
            });
            Actions.publishMessage('reports.unable-to-load', Constants.MESSAGE_TYPE.ERROR, Actions.loadAllReports);
        });
    },

    _initLoadUri: function (keys) {
        let url = BASE_URL;
        for (let i = 0, len = keys.length; i < len; i++) {
            url += (i === 0 ? '?' : '&') + 'key=' + keys[i];
        }
        return url;
    },

    onLoadReportsForSearch: function () {
        if (reportsLoading) {
            if (lastLoadWithKeys) {
                this._actuallyLoadReportsForSearch();
            }
        } else {
            if (this._reports && !lastLoadWithKeys) {
                this._searchReports = this._reports;
                this.trigger({
                    action: Actions.loadReportsForSearch,
                    reports: this._searchReports
                });
            } else {
                this._actuallyLoadReportsForSearch();
            }
        }
    },

    _actuallyLoadReportsForSearch: function () {
        Ajax.get(BASE_URL).end((data) => {
            this._searchReports = data;
            this.trigger({
                action: Actions.loadReportsForSearch,
                reports: this._searchReports
            });
        }, () => {
            this.trigger({
                action: Actions.loadReportsForSearch,
                reports: []
            });
        });
    },

    onLoadReport: function (key) {
        if (this._pendingLoad === key) {
            return;
        }
        this._pendingLoad = key;
        Ajax.get(BASE_URL_WITH_SLASH + key).end(function (data) {
            this._resetPendingLoad();
            JsonReferenceResolver.resolveReferences(data);
            this.trigger({
                action: Actions.loadReport,
                report: data
            });
        }.bind(this), function () {
            this._resetPendingLoad();
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
        JsonReferenceResolver.encodeReferences(report);
        Ajax.post(BASE_URL, report).end(function (data, resp) {
            if (onSuccess) {
                const key = Utils.extractKeyFromLocationHeader(resp);
                onSuccess(key);
            }
            this.onLoadAllReports();
        }.bind(this), onError);
    },

    onUpdateReport: function (report, onSuccess, onError) {
        JsonReferenceResolver.encodeReferences(report);
        Ajax.put(BASE_URL_WITH_SLASH + report.key).send(report).end(onSuccess, onError);
    },

    onSubmitReport: function (report, onSuccess, onError) {
        Ajax.post(BASE_URL_WITH_SLASH + 'chain/' + report.fileNumber + '/revisions').end(function (data, resp) {
            if (onSuccess) {
                const key = Utils.extractKeyFromLocationHeader(resp);
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
    },

    getReportsForSearch: function () {
        return this._searchReports;
    },

    onImportInitialReport: function (initialReport, onSuccess, onError) {
        Ajax.post(BASE_URL_WITH_SLASH + 'initial', initialReport).end((data) => {
            data.isNew = true;
            JsonReferenceResolver.resolveReferences(data);
            if (onSuccess) {
                onSuccess(data);
            }
        }, onError);
    }
});

module.exports = ReportStore;
