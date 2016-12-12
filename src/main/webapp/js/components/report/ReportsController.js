'use strict';

import React from "react";
import assign from "object-assign";
import Actions from "../../actions/Actions";
import ComponentStateStore from "../../stores/ComponentStateStore";
import Constants from "../../constants/Constants";
import DataFilter from "../../utils/DataFilter";
import Reports from "./Reports";
import ReportStore from "../../stores/ReportStore";
import RouterStore from "../../stores/RouterStore";
import Routes from "../../utils/Routes";
import Routing from "../../utils/Routing";

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
    const sortSpec = [];
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
        let prop, res = 0;
        for (let i = 0, len = sortSpec.length; i < len; i++) {
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

export default class ReportsController extends React.Component {

    constructor(props) {
        super(props);
        const storedState = ComponentStateStore.getComponentState(ReportsController.displayName);
        let sort = null;
        if (storedState) {
            sort = storedState.sort;
        }
        this.state = {
            reports: null,
            filter: this._resolveFilter(storedState),
            sort: sort ? sort : {
                identification: Constants.SORTING.NO,
                date: Constants.SORTING.NO
            }
        };
    }

    _resolveFilter(storedState) {
        const payload = RouterStore.getTransitionPayload(Routes.reports.name);
        RouterStore.clearTransitionPayload(Routes.reports.name);
        let filter = payload ? payload.filter : undefined;
        if (storedState && !filter) {
            filter = storedState.filter;
        }
        return filter;
    }

    componentDidMount() {
        this.unsubscribe = ReportStore.listen(this._onReportsLoaded);
        const reportKeys = this.props.location.query['reportKey'];
        if (!reportKeys) {
            Actions.loadAllReports();
        } else {
            Actions.loadAllReports(reportKeys);
        }
        Actions.loadOptions('reportingPhase');
    }

    _onReportsLoaded = (data) => {
        if (data.action === Actions.loadAllReports) {
            this.setState({reports: data.reports});
        }
    };

    componentWillUnmount() {
        this.unsubscribe();
    }

    onEdit = (report) => {
        Routing.transitionTo(Routes.editReport, {
            params: {reportKey: report.key},
            handlers: {onCancel: Routes.reports}
        });
    };

    onRemove = (report) => {
        Actions.deleteReportChain(report.fileNumber);
    };

    onFilterChange = (filter) => {
        const newFilter = assign({}, this.state.filter, filter);
        this.setState({filter: newFilter});
        this._rememberFilterAndSort(newFilter, this.state.sort);
    };

    _rememberFilterAndSort(filter, sort) {
        Actions.rememberComponentState(ReportsController.displayName, {
            filter: filter,
            sort: sort
        });
    }

    onSort = (column) => {
        const change = {};
        change[column] = sortStateTransition(this.state.sort[column]);
        const newSort = assign(this.state.sort, change);
        this.setState({sort: newSort});
        this._rememberFilterAndSort(this.state.filter, newSort);
    };

    _filterReports(reports) {
        return DataFilter.filterData(reports, this.state.filter);
    }

    _sortReports(reports) {
        if (reports) {
            const sort = getSorter(this.state.sort);
            if (sort) {
                reports.sort(sort);
            }
        }
        return reports;
    }


    render() {
        const actions = {
            onEdit: this.onEdit,
            onRemove: this.onRemove,
            onFilterChange: this.onFilterChange,
            onSort: this.onSort
        };
        let reports = this.state.reports;
        if (reports) {
            reports = reports.slice(0); // Shallow copy, so that sorting does not influence the original list
            reports = this._sortReports(this._filterReports(reports));
        }
        return <Reports allReports={this.state.reports} reports={reports} filter={this.state.filter}
                        sort={this.state.sort} actions={actions}/>;
    }
};
