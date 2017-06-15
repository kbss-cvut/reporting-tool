'use strict';

import React from "react";
import assign from "object-assign";
import Actions from "../../actions/Actions";
import ComponentStateStore from "../../stores/ComponentStateStore";
import Constants from "../../constants/Constants";
import DataFilter from "../../utils/DataFilter";
import I18nWrapper from "../../i18n/I18nWrapper";
import injectIntl from "../../utils/injectIntl";
import MessageStore from "../../stores/MessageStore";
import MessageWrapper from "../misc/hoc/MessageWrapper";
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
                if (a[prop] === undefined) {
                    if (b[prop] === undefined) {
                        res = 0;
                    } else {
                        res = -1;
                    }
                } else if (b[prop] === undefined) {
                    res = 1;
                } else {
                    res = a[prop] > b[prop] ? 1 : (a[prop] === b[prop] ? 0 : -1);
                }
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

class ReportsController extends React.Component {

    constructor(props) {
        super(props);
        this.i18n = props.i18n;
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
        this.unsubscribeMsg = MessageStore.listen(this._onMessage);
        const reportKeys = this.props.location.query['reportKey'];
        if (!reportKeys) {
            Actions.loadAllReports();
        } else {
            Actions.loadAllReports(Array.isArray(reportKeys) ? reportKeys : [reportKeys]);
        }
        Actions.loadOptions(Constants.OPTIONS.REPORTING_PHASE);
    }

    _onReportsLoaded = (data) => {
        if (data.action === Actions.loadAllReports) {
            this.setState({reports: data.reports});
        }
    };

    _onMessage = (msg) => {
        if (msg.source === Actions.loadAllReports) {
            this.props.showMessage(this.i18n(msg.message), msg.type);
        }
    };

    componentWillUnmount() {
        this.unsubscribe();
        this.unsubscribeMsg();
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
            reports = reports.slice(); // Shallow copy, so that sorting does not influence the original list
            reports = this._sortReports(this._filterReports(reports));
        }
        return <Reports allReports={this.state.reports} reports={reports} filter={this.state.filter}
                        sort={this.state.sort} actions={actions}/>;
    }
}

export default injectIntl(I18nWrapper(MessageWrapper(ReportsController)));
