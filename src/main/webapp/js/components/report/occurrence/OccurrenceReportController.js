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
