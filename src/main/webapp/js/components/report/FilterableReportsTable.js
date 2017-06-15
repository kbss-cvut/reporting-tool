'use strict';

var React = require('react');
var assign = require('object-assign');
var Button = require('react-bootstrap').Button;
var ButtonToolbar = require('react-bootstrap').ButtonToolbar;
var OverlayTrigger = require('react-bootstrap').OverlayTrigger;
var Popover = require('react-bootstrap').Popover;

var Constants = require('../../constants/Constants');
var Filters = require('../filter/Filters').default;
var injectIntl = require('../../utils/injectIntl');
var I18nMixin = require('../../i18n/I18nMixin');
var ReportsTable = require('./ReportsTable');
var ReportType = require('../../model/ReportType');
var Select = require('../Select');

var FilterableReportsTable = React.createClass({
    mixins: [I18nMixin],

    propTypes: {
        allReports: React.PropTypes.array,
        reports: React.PropTypes.array,
        actions: React.PropTypes.object.isRequired,
        sort: React.PropTypes.object,
        filter: React.PropTypes.object
    },

    getDefaultProps: function () {
        return {
            filter: {}
        }
    },

    getInitialState: function () {
        return {
            types: this.props.filter['types'] ? this.props.filter['types'] : Constants.FILTER_DEFAULT
        };
    },

    onSelect: function (e) {
        var value = e.target.value;
        var change = {};
        change[e.target.name] = value;
        this.onFilterChange(change);
    },

    onFilterChange: function (change) {
        this.setState(change);
        this.props.actions.onFilterChange(change);
    },

    _onTypeToggle: function (type) {
        var change = {};
        if (type !== Constants.FILTER_DEFAULT) {
            var origTypes = Array.isArray(this.state.types) ? this.state.types.slice() : [this.state.types];
            if (origTypes.indexOf(type) === -1) {   // Add type to filter
                change.types = [type].concat(origTypes);
                if (change.types.indexOf(Constants.FILTER_DEFAULT) !== -1) {
                    change.types.splice(change.types.indexOf(Constants.FILTER_DEFAULT), 1);
                }
            } else {    // Remove type from filter
                origTypes.splice(origTypes.indexOf(type), 1);
                change.types = origTypes;
            }
            if (change.types.length === 0) {    // If no filters left, reset back to All
                change.types = Constants.FILTER_DEFAULT;
            }
        } else {
            change.types = Constants.FILTER_DEFAULT;
        }
        this.setState(change);
        this.props.actions.onFilterChange(change);
    },

    onResetFilters: function (reset) {
        var newState = {};
        Object.getOwnPropertyNames(this.state).forEach((key) => {
            newState[key] = Constants.FILTER_DEFAULT;
        });
        this.setState(newState);
        this.props.actions.onFilterChange(assign({}, newState, reset));
    },


    render: function () {
        return <div>
            <div className='type-filters'>
                <OverlayTrigger trigger='click' rootClose placement='right' overlay={this._renderFilters()}>
                    <Button bsStyle='primary'>{this.i18n('filters.label')}</Button>
                </OverlayTrigger>
            </div>
            {this._renderReportTypeFilters()}
            <ReportsTable {...this.props}/>
        </div>;
    },

    _renderFilters: function () {
        return <Popover id='popover-filters' title={this.i18n('filters.label')} placement='right'>
            <Filters ref={c => this.filters = c} filters={this.props.filter} onChange={this.onFilterChange}
                     data={this.props.allReports} onResetFilters={this.onResetFilters}/>
        </Popover>;
    },

    _renderReportTypeFilters: function () {
        var types = this._getReportTypes();
        if (types.length <= 1) {
            return null;
        }
        return <div className='row'>
            <div className='type-filters-label'>
                <label className='control-label'>{this.i18n('reports.filter.type.label')}</label>
            </div>
            <div className='col-xs-10'>
                {this._renderReportTypeFilterButtons(types)}
            </div>
        </div>;
    },

    _renderReportTypeFilterButtons: function (types) {
        var type,
            buttons = [],
            filteredTypes = this.state['types'], i18n = this.i18n;
        buttons.push(<Button key={Constants.FILTER_DEFAULT} bsSize='small'
                             bsStyle={filteredTypes.indexOf(Constants.FILTER_DEFAULT) !== -1 ? 'primary' : 'default'}
                             onClick={() => this._onTypeToggle(Constants.FILTER_DEFAULT)}>{this.i18n('reports.filter.type.all')}</Button>);
        for (var i = 0, len = types.length; i < len; i++) {
            type = types[i];
            ((type) => {
                buttons.push(<Button key={type.type} onClick={() => this._onTypeToggle(type.type)} bsSize='small'
                                     bsStyle={filteredTypes.indexOf(type.type) !== -1 ? 'primary' : 'default'}>{i18n(type.label)}</Button>);
            })(type);
        }
        return <ButtonToolbar className='type-filters'>
            {buttons}
        </ButtonToolbar>;
    },

    _renderSelect: function (name, value, options) {
        options.unshift(this._allFilterOption());
        return <Select name={name} value={value} options={options} onChange={this.onSelect}/>;
    },

    _getReportTypes: function () {
        var types = [],
            typeSet = [],
            reportTypes,
            reports = this.props.allReports;
        for (var i = 0, len = reports.length; i < len; i++) {
            reportTypes = reports[i].types;
            if (!reportTypes || reportTypes.length === 0) {
                continue;
            }
            for (var j = 0, lenn = reportTypes.length; j < lenn; j++) {
                var typeLabel = ReportType.getTypeLabel(reportTypes[j]);
                if (typeLabel && typeSet.indexOf(reportTypes[j]) === -1) {
                    typeSet.push(reportTypes[j]);
                    types.push({type: reportTypes[j], label: typeLabel});
                }
            }
        }
        types.sort((a, b) => a.label.localeCompare(b.label));   // Sort types by label
        return types;
    },

    _allFilterOption: function () {
        return {value: Constants.FILTER_DEFAULT, label: this.i18n('reports.filter.type.all')};
    }
});

module.exports = injectIntl(FilterableReportsTable);
