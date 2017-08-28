'use strict';

import React from "react";
import I18nWrapper from "../../../i18n/I18nWrapper";
import injectIntl from "../../../utils/injectIntl";
import StatisticsStore from "../../../stores/StatisticsStore";
import Actions from "../../../actions/Actions";
import {BarChart, Bar, Brush, XAxis, YAxis, CartesianGrid, Tooltip, Legend} from "recharts";
import Utils from "../Utils";
import LoadingWrapper from "../../misc/hoc/LoadingWrapper";

class OccurrenceSeverityTrends extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
        }
    };

    componentWillMount() {
        this.props.loadingOn();
        Actions.loadStatistics("occurrenceseveritytrends_grouped");
        this.unsubscribe = StatisticsStore.listen(this._onStatisticsLoaded);
    };

    componentWillUnmount() {
        this.unsubscribe();
    };

    _onStatisticsLoaded = (data) => {
        if (data === undefined) {
            return
        }
        if (data.queryName != "occurrenceseveritytrends_grouped") {
            return;
        }

        if (data.queryResults === undefined) {
            return;
        }
        const rows = Utils.sparql2table(data.queryResults.results.bindings);
        const {maxDate} = Utils.getMonthRangeFromNow(24);
        const {min} = Utils.generateMinMax(rows);
        const data2 = Utils.generateMonthTimeAxis( min, maxDate).map((item) => {
            const match = rows.filter((item2) => {
                return (Utils.getDateInt(item2.year, item2.month)) == item
            });
            let c1xx = 0, c2xx = 0, c3xx = 0, c4xx = 0, c5xx = 0;
            if (match && match[0]) {
                c1xx = c1xx + Number(match[0].c1xx);
                c2xx = c2xx + Number(match[0].c2xx);
                c3xx = c3xx + Number(match[0].c3xx);
                c4xx = c4xx + Number(match[0].c4xx);
                c5xx = c5xx + Number(match[0].c5xx);
            }
            return {
                date: item,
                "Accident": c1xx,
                "Serious Incident": c2xx,
                "Incident": c3xx,
                "Occurrence Without Safety Effect": c4xx,
                "Not Determined": c5xx
            }
        });

        const barLabels = ["Not Determined", "Occurrence Without Safety Effect", "Incident", "Serious Incident", "Accident"];
        const color=['#D8D8D8','#fff800', '#FFCC78','#ED8800','#E70000'];

        const bars = barLabels.map((label, index) => {
            return <Bar key={index} dataKey={label} stackId="a" fill={color[index]}/>
        });

        this.setState(
            {
                data: data2,
                bars: bars
            }
        );
        this.props.loadingOff();
    };

    render() {
        return <div>
            <BarChart width={600} height={300} data={this.state.data}
                      margin={{top: 20, right: 30, left: 20, bottom: 5}}>
                <XAxis dataKey="date" tickFormatter={Utils.getDateString}/>
                <YAxis/>
                <CartesianGrid strokeDasharray="3 3"/>
                <Tooltip labelFormatter={Utils.getDateString}/>
                <Legend />
                {this.state.bars}
                <Brush dataKey='date' height={30} stroke="orange"/>
            </BarChart>
        </div>;
    };
}

export default injectIntl(I18nWrapper(LoadingWrapper(OccurrenceSeverityTrends, {maskClass: 'mask-container'})));