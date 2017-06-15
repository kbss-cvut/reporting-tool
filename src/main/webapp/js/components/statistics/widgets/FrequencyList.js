'use strict';

import React from "react";
import I18nWrapper from "../../../i18n/I18nWrapper";
import injectIntl from "../../../utils/injectIntl";
import StatisticsStore from "../../../stores/StatisticsStore";
import Actions from "../../../actions/Actions";
import FrequencyListRow from "./FrequencyListRow";
import Utils from "../Utils";
import Table from "react-bootstrap/lib/Table";
import PagingMixin from "../../mixin/PagingMixin";
import LoadingWrapper from "../../misc/hoc/LoadingWrapper";

var FrequencyList = React.createClass({
    mixins: [PagingMixin],

    propTypes: {
        query: React.PropTypes.string.isRequired,
        allowZeros: React.PropTypes.bool.isRequired,
        // onSelect: React.PropTypes.function.isRequired
    },

    getInitialState() {
        return {
            eventTypes: [],
            rows: []
        };
    },

    componentWillMount() {
        this.props.loadingOn();
        Actions.loadStatistics(this.props.query);
        this.unsubscribe = StatisticsStore.listen(this._onStatisticsLoaded);
    },

    componentWillUnmount() {
        this.unsubscribe();
    },

    _onStatisticsLoaded(data) {
        if (data === undefined) {
            return;
        }

        if (data.queryName != this.props.query) {
            return;
        }

        if (!data.queryResults) {
            return;
        }

        const rowData = Utils.sparql2table(data.queryResults.results.bindings);
        const eventTypesIris = Utils.unique(rowData.map((item) => {
            return item.event_type_iri
        }));

        const {minDate, maxDate} = Utils.getMonthRangeFromNow(12);
        let rows = [];
        for (let i in eventTypesIris) {
            const eventTypeIri = eventTypesIris[i];
            const vals = rowData.filter((item2) => {
                return (item2.event_type_iri == eventTypeIri)
            });
            let data = Utils.generateMonthTimeAxis(minDate, maxDate).map((item) => {
                const match = vals.filter((item2) => {
                    return (Number(item2.year) * 100 + Number(item2.month)) == item
                });
                let count = 0;
                if (match && match[0]) {
                    count = count + Number(match[0].count)
                }

                return {
                    date: item,
                    count: count,
                }
            });

            const sum= data.reduce((memo, val) => memo + Number(val.count), 0);

            if ( this.props.allowZeros || ( sum > 0 ) ) {
                rows.push({
                    key: i,
                    data: data,
                    totalSum: sum,
                    eventType: vals[0].event_type,
                    eventTypeIri: eventTypeIri
                });
            }
        }

        rows = rows.sort((a, b) => {
            return b.totalSum - a.totalSum
        });

        this.setState(
            {
                rows: rows
            }
        );
        this.props.loadingOff();
    },

    render() {
        const topList = this.state.rows.map((row) => {
            return ( <FrequencyListRow key={row.key} row={row} onClick={this.props.onSelect}/> );
        });

        return (
            <div>
                <Table striped bordered condensed hover>
                    <thead>
                    <tr>
                        <th className='col-xs-4 content-center'>Event Type</th>
                        <th className='col-xs-1 content-center'>Annual Count</th>
                        <th className='col-xs-2 content-center'>Annual Trend</th>
                    </tr>
                    </thead>
                    <tbody>
                     {this.getCurrentPage(topList)}
                    </tbody>
                </Table>
                {this.renderPagination(topList)}
            </div> );
    }
});
module.exports = injectIntl(I18nWrapper(LoadingWrapper(FrequencyList, {maskClass: 'mask-container'})));
