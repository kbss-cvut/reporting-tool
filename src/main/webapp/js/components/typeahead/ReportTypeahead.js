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

var React = require('react');
var Reflux = require('reflux');
var Typeahead = require('react-bootstrap-typeahead');

var injectIntl = require('../../utils/injectIntl');

var Actions = require('../../actions/Actions');
var ReportStore = require('../../stores/ReportStore');
var ReportType = require('../../model/ReportType');
var TypeaheadResultList = require('./TypeaheadResultList');
var Utils = require('../../utils/Utils');
var I18nMixin = require('../../i18n/I18nMixin');

var ReportTypeahead = React.createClass({
    propTypes: {
        name: React.PropTypes.string,
        onChange: React.PropTypes.func
    },

    mixins: [Reflux.ListenerMixin, I18nMixin],

    getInitialState: function () {
        return {
            options: this._processReports(ReportStore.getReports())
        };
    },

    componentWillMount: function () {
        this.listenTo(ReportStore, this.onReportsLoaded);
    },

    componentDidMount: function () {
        this.refs.reportTypeahead.focus();
    },

    onReportsLoaded: function (data) {
        if (data.action !== Actions.loadAllReports) {
            return;
        }
        this.setState({options: this._processReports(data.reports)});
    },

    _processReports: function (reports) {
        var options = [];
        for (var i = 0, len = reports.length; i < len; i++) {
            options.push(ReportType.getReport(reports[i]));
        }
        return options;
    },

    onOptionSelected: function (option) {
        this.props.onChange(option);
    },

    render: function () {
        var classes = {
            input: 'form-control dashboard-report-search',
            results: 'dashboard-report-search-results'
        };
        var optionLabel = function (option) {
            return option.identification + ' (' + Utils.formatDate(new Date(option.date)) + ' - ' + this.i18n(option.toString()) + ')';
        }.bind(this);
        return (
            <Typeahead ref='reportTypeahead' className='form-group form-group-sm' name={this.props.name}
                       formInputOption='id' placeholder={this.i18n('dashboard.search-placeholder')}
                       onOptionSelected={this.onOptionSelected} filterOption='identification'
                       displayOption={optionLabel} options={this.state.options} customClasses={classes}
                       customListComponent={TypeaheadResultList}/>
        );
    }
});

module.exports = injectIntl(ReportTypeahead);
