/**
 * @jsx
 */
'use strict';

var React = require('react');
var Reflux = require('reflux');
var Button = require('react-bootstrap').Button;

var Constants = require('../../constants/Constants');
var injectIntl = require('../../utils/injectIntl');
var I18nMixin = require('../../i18n/I18nMixin');
var JsonLdUtils = require('../../utils/JsonLdUtils').default;
var OptionsStore = require('../../stores/OptionsStore');
var ReportType = require('../../model/ReportType');
var Select = require('../Select');
var Vocabulary = require('../../constants/Vocabulary');

var ReportsFilter = React.createClass({
    mixins: [I18nMixin, Reflux.listenTo(OptionsStore, '_onPhasesLoaded')],

    propTypes: {
        onFilterChange: React.PropTypes.func.isRequired,
        reports: React.PropTypes.array,
        filter: React.PropTypes.object
    },

    getInitialState: function () {
        var filterInit = this.props.filter ? this.props.filter : {};
        return {
            'phase': filterInit['phase'] ? filterInit['phase'] : Constants.FILTER_DEFAULT,
            'types': filterInit['types'] ? filterInit['types'] : Constants.FILTER_DEFAULT
        }
    },

    _onPhasesLoaded(type) {
        if (type === 'reportingPhase') {
            this.forceUpdate();
        }
    },

    onSelect: function (e) {
        var value = e.target.value;
        var change = {};
        change[e.target.name] = value;
        this.setState(change);
        this.props.onFilterChange(change);
    },

    onResetFilters: function () {
        var newState = {};
        Object.getOwnPropertyNames(this.state).forEach((key) => {
            newState[key] = Constants.FILTER_DEFAULT;
        });
        this.setState(newState);
        this.props.onFilterChange(newState);
    },


    render: function () {
        return (
            <tr className='filter'>
                <td>&nbsp;</td>
                <td>&nbsp;</td>
                <td>&nbsp;</td>
                <td>{this._renderSelect('types', this.state.types, this._getReportTypeOptions())}</td>
                <td>{this._renderSelect('phase', this.state.phase, this._getReportingPhaseOptions())}</td>
                <td >
                    <Button bsStyle='primary' bsSize='small' className='reset-filters'
                            onClick={this.onResetFilters}>{this.i18n('reports.filter.reset')}</Button>
                </td>
            </tr>
        );
    },

    _renderSelect: function (name, value, options) {
        options.unshift(this._allFilterOption());
        return <Select name={name} value={value} options={options} onChange={this.onSelect}/>;
    },

    _getReportTypeOptions: function () {
        var types = [],
            options = [],
            reportTypes,
            reports = this.props.reports;
        for (var i = 0, len = reports.length; i < len; i++) {
            reportTypes = reports[i].types;
            if (!reportTypes || reportTypes.length === 0) {
                continue;
            }
            for (var j = 0, lenn = reportTypes.length; j < lenn; j++) {
                var typeLabel = ReportType.getTypeLabel(reportTypes[j]);
                if (typeLabel && types.indexOf(reportTypes[j]) === -1) {
                    types.push(reportTypes[j]);
                    options.push({value: reportTypes[j], label: this.i18n(typeLabel)});
                }
            }
        }
        return options;
    },

    _allFilterOption: function () {
        return {value: Constants.FILTER_DEFAULT, label: this.i18n('reports.filter.type.all')};
    },

    _getReportingPhaseOptions: function () {
        var phases = OptionsStore.getOptions('reportingPhase'),
            options = [];
        for (var i = 0, len = phases.length; i < len; i++) {
            options.push({
                value: phases[i]['@id'],
                label: JsonLdUtils.getLocalized(phases[i][Vocabulary.RDFS_LABEL], this.props.intl)
            });
        }
        return options;
    }
});

module.exports = injectIntl(ReportsFilter);
