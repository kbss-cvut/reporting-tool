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
