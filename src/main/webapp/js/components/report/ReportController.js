'use strict';

var React = require('react');
var Reflux = require('reflux');

var Actions = require('../../actions/Actions');
var Constants = require('../../constants/Constants');
var Logger = require('../../utils/Logger');
var ReportFactory = require('../../model/ReportFactory');
var Report = require('./Report').default;
var OptionsStore = require('../../stores/OptionsStore'); // Force store initialization, so that it can listen to actions
var ReportStore = require('../../stores/ReportStore');
var RouterStore = require('../../stores/RouterStore');
var Routes = require('../../utils/Routes');

var ReportController = React.createClass({
    mixins: [Reflux.listenTo(ReportStore, 'onReportStoreTrigger')],

    getInitialState: function () {
        return {
            key: null,
            report: this._isNew() ? this.initNewReport() : null,
            revisions: null,
            loading: false
        };
    },

    _isNew: function () {
        return !this.props.params.reportKey;
    },

    initNewReport: function () {
        var payload = RouterStore.getTransitionPayload(Routes.createReport.name),
            report = ReportFactory.createOccurrenceReport();
        if (payload) {
            report.initialReports = payload.initialReports;
        }
        return report;
    },

    componentWillMount: function () {
        if (!this._isNew()) {
            this._loadReport(this.props.params.reportKey);
        }
    },

    componentDidMount: function () {
        Actions.loadOptions();
        Actions.loadOptions(Constants.OPTIONS.OCCURRENCE_CATEGORY);
        Actions.loadOptions('factorType');
    },

    _loadReport: function (reportKey) {
        Actions.loadReport(reportKey);
        this.setState({loading: true, key: reportKey});
    },

    componentWillReceiveProps: function (nextProps) {
        if (nextProps.params.reportKey && this.state.key !== nextProps.params.reportKey) {
            this._loadReport(nextProps.params.reportKey);
        }
    },

    onReportStoreTrigger: function (data) {
        if (data.action === Actions.loadReport) {
            this._onReportLoaded(data.report);
        } else if (data.action == Actions.loadRevisions) {
            this.setState({revisions: data.revisions});
        }
    },

    _onReportLoaded: function (report) {
        if (!report) {
            this.setState({loading: false});
        } else {
            Logger.log('Loaded report ' + report.uri);
            this.setState({report: report, loading: false});
            Actions.loadRevisions(report.fileNumber);
        }
    },


    render: function () {
        return <Report report={this.state.report} revisions={this.state.revisions} loading={this.state.loading}/>;
    }
});

module.exports = ReportController;
