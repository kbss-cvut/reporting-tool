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

import React from "react";
import ReactPivot from "react-pivot";
import I18nWrapper from "../../../i18n/I18nWrapper";
import injectIntl from "../../../utils/injectIntl";
import StatisticsStore from "../../../stores/StatisticsStore";
import Actions from "../../../actions/Actions";
import Utils from "../Utils";
import LoadingWrapper from "../../misc/hoc/LoadingWrapper";

class EventFactorChains extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            rows: [],
            dimensions: [],
            reduce: (row, memo) => { return memo },
            calculations: []
        }
    }

    componentWillMount() {
        this.props.loadingOn();
        Actions.loadStatistics("eventfactorgraph");
        this.unsubscribe = StatisticsStore.listen(this._onStatisticsLoaded);
    };

    componentWillUnmount() {
        this.unsubscribe();
    };

    _onStatisticsLoaded = (data) => {
        if (data && ( data.queryName != "eventfactorgraph")) {
            return;
        }

        this.setState(
            {
                width: 800
            }
        );

        if (data) {
            const rows =  Utils.sparql2table(data.queryResults.results.bindings);
            const dimensions = data.queryResults.head.vars.filter(
                (varName) => {
                    return (!varName.startsWith('count'))
                }).map(
                (varName) => {
                    return {value:varName, title: varName.replace('_', ' ')}
                }
            );
            const calculations = [{
                title: 'count', value: 'count',
                template: function (val) {
                    return val;
                }
            }];

            this.setState(
                {
                    rows: rows,
                    dimensions: dimensions,
                    calculations: calculations,
                    reportKey: Date.now()
                }
            );
            this.props.loadingOff();
        }
    };

    reduce = (row, memo) => {
        memo.count = (memo.count || 0) + Number(row.count);
        return memo;
    };

    render() {
        return ( <div className='centered'>
            <ReactPivot
                key={this.state.reportKey}
                rows={this.state.rows}
                dimensions={this.state.dimensions}
                reduce={this.reduce}
                calculations={this.state.calculations}
                activeDimensions={this.state.dimensions[0]}
                sortDir='desc'
                nPaginateRows={10}
                compact={true}/>
        </div> );
    }
}

export default injectIntl(I18nWrapper(LoadingWrapper(EventFactorChains, {maskClass: 'mask-container'})));