'use strict';

var React = require('react');
var assign = require('object-assign');

var Actions = require('../../actions/Actions');
var RevisionInfo = require('../report/RevisionInfo');
var Routes = require('../../utils/Routes');
var Routing = require('../../utils/Routing');

/**
 * Aggregates some of the methods that are common to all report detail controllers.
 */
var ReportDetailControllerMixin = {

    onChange: function (changes) {
        var report = assign(this.props.report, changes);
        this.setState({report: report}); // Force update
    },

    onRevisionSelected: function (revision) {
        this.loadReport(revision.key);
    },

    isLatestRevision: function () {
        var revisions = this.props.revisions;
        if (!revisions || revisions.length === 0) {
            return true;
        }
        return this.props.report.revision === revisions[0].revision;
    },

    onRemove: function (onError) {
        Actions.deleteReportChain(this.props.report.fileNumber, this.onRemoveSuccess, onError);
    },

    onRemoveSuccess: function () {
        Routing.transitionTo(Routes.reports);
    },


    renderRevisionInfo: function () {
        if (!this.props.revisions || this.props.revisions.length === 0) {
            return null;
        }
        return <RevisionInfo revisions={this.props.revisions} selectedRevision={this.props.report.revision}
                             onSelect={this.onRevisionSelected}/>;
    }
};

module.exports = ReportDetailControllerMixin;
