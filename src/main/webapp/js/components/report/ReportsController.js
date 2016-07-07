'use strict';

var React = require('react');
var Reflux = require('reflux');
var assign = require('object-assign');

var Actions = require('../../actions/Actions');
var ComponentStateStore = require('../../stores/ComponentStateStore');
var Constants = require('../../constants/Constants');
var DataFilter = require('../../utils/DataFilter');
var ReportStore = require('../../stores/ReportStore');
var Reports = require('./Reports');
var RouterStore = require('../../stores/RouterStore');
var Routes = require('../../utils/Routes');
var Routing = require('../../utils/Routing');

function sortStateTransition(current) {
    switch (current) {
        case Constants.SORTING.NO:
            return Constants.SORTING.DESC;
        case Constants.SORTING.DESC:
            return Constants.SORTING.ASC;
        default:
            return Constants.SORTING.NO;
    }
}

function getSorter(sort) {
    var sortSpec = [];
    if (sort.identification !== Constants.SORTING.NO) {
        sortSpec.push({
            prop: 'identification',
            desc: sort.identification === Constants.SORTING.DESC
        });
    }
    if (sort.date !== Constants.SORTING.NO) {
        sortSpec.push({
            prop: 'date',
            desc: sort.date === Constants.SORTING.DESC
        });
    }
    return sortSpec.length > 0 ? sortFactory(sortSpec) : null;
}

function sortFactory(sortSpec) {
    return function (a, b) {
        var prop, res = 0;
        for (var i = 0, len = sortSpec.length; i < len; i++) {
            prop = sortSpec[i].prop;
            if (typeof(a[prop]) === 'string') {
                res = a[prop].localeCompare(b[prop]);
            } else {
                res = a[prop] > b[prop] ? 1 : (a[prop] === b[prop] ? 0 : -1);
            }
            if (sortSpec[i].desc) {
                res *= -1;
            }
            if (res !== 0) {
                return res;
            }
        }
        return res;
    }
}

var ReportsController = React.createClass({
    mixins: [Reflux.listenTo(ReportStore, 'onReportsLoaded')],

    getInitialState: function () {
        var payload = RouterStore.getTransitionPayload(Routes.reports.name),
            sort = null, filter, storedState;
        RouterStore.setTransitionPayload(Routes.reports.name);  // Clear payload
        filter = payload ? payload.filter : null;
        if ((storedState = ComponentStateStore.getComponentState(ReportsController.displayName))) {
            sort = storedState.sort;
            if (!filter) {
                filter = storedState.filter;
            }
        }
        return {
            reports: null,
            filter: filter,
            sort: sort ? sort : {
                identification: Constants.SORTING.NO,
                date: Constants.SORTING.NO
            }
        };
    },

    componentDidMount: function () {
        Actions.loadAllReports();
        Actions.loadOptions('reportingPhase');
    },

    onReportsLoaded: function (data) {
        if (data.action === Actions.loadAllReports) {
            this.setState({reports: data.reports});
        }
    },

    onEdit: function (report) {
        Routing.transitionTo(Routes.editReport, {
            params: {reportKey: report.key},
            handlers: {onCancel: Routes.reports}
        });
    },

    onRemove: function (report) {
        Actions.deleteReportChain(report.fileNumber);
    },

    onFilterChange: function (filter) {
        var newFilter = assign({}, this.state.filter, filter);
        this.setState({filter: newFilter});
        this._rememberFilterAndStort(newFilter, this.state.sort);
    },

    _rememberFilterAndStort: function (filter, sort) {
        Actions.rememberComponentState(ReportsController.displayName, {
            filter: filter,
            sort: sort
        });
    },

    onSort: function (column) {
        var change = {}, newSort;
        change[column] = sortStateTransition(this.state.sort[column]);
        newSort = assign(this.state.sort, change);
        this.setState({sort: newSort});
        this._rememberFilterAndStort(this.state.filter, newSort);
    },

    _filterReports: function (reports) {
        return DataFilter.filterData(reports, this.state.filter);
    },

    _sortReports: function (reports) {
        if (reports) {
            var sort = getSorter(this.state.sort);
            if (sort) {
                reports.sort(sort);
            }
        }
        return reports;
    },


    render: function () {
        var actions = {
                onEdit: this.onEdit,
                onRemove: this.onRemove,
                onFilterChange: this.onFilterChange,
                onSort: this.onSort
            },
            reports = this.state.reports;
        if (reports) {
            reports = reports.slice(0); // Shallow copy, so that sorting does not influence the original list
            reports = this._sortReports(this._filterReports(reports));
        }
        return <Reports allReports={this.state.reports} reports={reports} filter={this.state.filter}
                        sort={this.state.sort} actions={actions}/>;
    }
});

module.exports = ReportsController;
