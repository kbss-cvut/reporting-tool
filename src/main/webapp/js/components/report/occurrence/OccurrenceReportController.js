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

var React = require('react');

var Actions = require('../../../actions/Actions');
var Constants = require('../../../constants/Constants');
var ReportDetail = require('./OccurrenceReport');
var Routing = require('../../../utils/Routing');
var Routes = require('../../../utils/Routes');
var RouterStore = require('../../../stores/RouterStore');
var ReportDetailControllerMixin = require('../../mixin/ReportDetailControllerMixin');

var OccurrenceReportController = React.createClass({
    mixins: [
        ReportDetailControllerMixin
    ],

    componentDidMount: function () {
        Actions.loadOptions();
        Actions.loadOptions(Constants.OPTIONS.OCCURRENCE_CATEGORY);
        Actions.loadOptions('factorType');
    },

    onSuccess: function (key) {
        if (this.props.report.isNew) {
            Routing.transitionTo(Routes.reports);
        } else if (!key || key === this.props.report.key) {
            Actions.loadReport(this.props.report.key);
        } else {
            this.loadReport(key);
        }
    },

    loadReport: function (key) {
        Routing.transitionTo(Routes.editReport, {
            params: {reportKey: key},
            handlers: {onCancel: Routes.reports}
        });
    },

    onCancel: function () {
        var handlers = RouterStore.getViewHandlers(Routes.editReport.name);
        if (handlers) {
            Routing.transitionTo(handlers.onCancel);
        } else {
            Routing.transitionTo(Routes.reports);
        }
    },


    render: function () {
        var handlers = {
            onChange: this.onChange,
            onSuccess: this.onSuccess,
            onCancel: this.onCancel,
            onRemove: this.onRemove
        };
        return <ReportDetail report={this.props.report} handlers={handlers} revisions={this.renderRevisionInfo()}
                             readOnly={!this.isLatestRevision()}/>;
    }
});

module.exports = OccurrenceReportController;
