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
/**
 * @jsx
 */

'use strict';

var React = require('react');
var Button = require('react-bootstrap').Button;
var Panel = require('react-bootstrap').Panel;

var injectIntl = require('../../utils/injectIntl');

var Constants = require('../../constants/Constants');
var ReportsTable = require('./ReportsTable');
var Mask = require('./../Mask').default;
var Routing = require('../../utils/Routing');
var I18nMixin = require('../../i18n/I18nMixin');

var Reports = React.createClass({
    mixins: [I18nMixin],

    propTypes: {
        allReports: React.PropTypes.array,
        reports: React.PropTypes.array,
        actions: React.PropTypes.object,
        filter: React.PropTypes.object
    },

    createReport: function () {
        Routing.transitionToHome({payload: {dashboard: Constants.DASHBOARDS.CREATE_REPORT.id}});
    },


    render: function () {
        var reports = this.props.reports;
        if (reports === null) {
            return (
                <Mask text={this.i18n('reports.loading-mask')}/>
            );
        }
        return (
            <Panel header={<h3>{this.i18n('reports.panel-title')}</h3>} bsStyle='primary'>
                <ReportsTable {...this.props}/>
                {this.renderNoReports()}
            </Panel>);
    },

    renderNoReports: function () {
        if (this.props.reports.length !== 0) {
            return <div>
                <Button bsStyle='primary' onClick={this.createReport}>{this.i18n('reports.create-report')}</Button>
            </div>;
        }
        if (this._areReportsFiltered()) {
            return <div className='no-reports-notice italics'>{this.i18n('reports.filter.no-matching-found')}</div>;
        } else {
            return (
                <div className='no-reports-notice italics'>
                    {this.i18n('reports.no-reports')}
                    <a href='#' onClick={this.createReport} title={this.i18n('reports.no-reports.link-tooltip')}>
                        {this.i18n('reports.no-reports.link')}
                    </a>
                </div>);
        }
    },

    _areReportsFiltered: function () {
        return this.props.reports.length !== this.props.allReports.length;
    }
});

module.exports = injectIntl(Reports);
