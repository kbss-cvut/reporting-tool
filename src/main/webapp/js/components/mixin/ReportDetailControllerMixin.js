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
var assign = require('object-assign');

var RevisionInfo = require('../report/RevisionInfo');

/**
 * Aggregates some of the methods that are common to both Investigation and Preliminary report detail controllers.
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


    renderRevisionInfo: function () {
        if (!this.props.revisions || this.props.revisions.length === 0) {
            return null;
        }
        return <RevisionInfo revisions={this.props.revisions} selectedRevision={this.props.report.revision}
                             onSelect={this.onRevisionSelected}/>;
    }
};

module.exports = ReportDetailControllerMixin;
