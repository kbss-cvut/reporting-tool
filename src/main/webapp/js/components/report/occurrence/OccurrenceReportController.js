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

const React = require('react');

const Actions = require('../../../actions/Actions');
const Constants = require('../../../constants/Constants');
const InvalidReportTimeFix = require('./InvalidReportTimeFix').default;
let ReportDetail = require('./OccurrenceReport');
const Routing = require('../../../utils/Routing');
const Routes = require('../../../utils/Routes');
const RouterStore = require('../../../stores/RouterStore');
const ReportDetailControllerMixin = require('../../mixin/ReportDetailControllerMixin');
const ReportValidator = require('../../../validation/ReportValidator');
const ReportNotRenderable = require('../../ReportNotRenderable').default;

const OccurrenceReportController = React.createClass({
    mixins: [
        ReportDetailControllerMixin
    ],

    componentDidMount: function () {
        Actions.loadOptions(Constants.OPTIONS.OCCURRENCE_CLASS);
        Actions.loadOptions(Constants.OPTIONS.OCCURRENCE_CATEGORY);
        Actions.loadOptions(Constants.OPTIONS.FACTOR_TYPE);
    },

    getInitialState: function () {
        return {
            showFix: false
        }
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
        const handlers = RouterStore.getViewHandlers(Routes.editReport.name);
        if (handlers) {
            Routing.transitionTo(handlers.onCancel);
        } else {
            Routing.transitionTo(Routes.reports);
        }
    },

    _onFixRenderingIssue: function () {
        this.setState({showFix: true});
    },

    _onFinishFix: function () {
        this.setState({showFix: false});
    },


    render: function () {
        const report = this.props.report;
        if (this.state.showFix) {
            return <InvalidReportTimeFix report={this.props.report} onChange={this.onChange}
                                         onFinish={this._onFinishFix}/>
        }
        if (!ReportValidator.canRender(report)) {
            const error = ReportValidator.getRenderError(report);
            return <ReportNotRenderable messageId={error.messageId} canFix={error.canFix}
                                        onFix={this._onFixRenderingIssue}/>;
        }
        const handlers = {
            onChange: this.onChange,
            onSuccess: this.onSuccess,
            onCancel: this.onCancel,
            onRemove: this.onRemove
        };
        return <ReportDetail report={report} handlers={handlers} revisions={this.renderRevisionInfo()}
                             readOnly={!this.isLatestRevision()}/>;
    }
});

module.exports = OccurrenceReportController;
