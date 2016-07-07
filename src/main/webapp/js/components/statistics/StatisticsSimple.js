'use strict';

import React from "react";
import ReactPivot from "react-pivot";
import {Treemap, PieChart} from "react-d3";
import I18nWrapper from "../../i18n/I18nWrapper";
import injectIntl from "../../utils/injectIntl";
import Logger from "../../utils/Logger";
import Input from "../Input";
import StatisticsStore from "../../stores/StatisticsStore";
import Actions from "../../actions/Actions";

class StatisticsSimple extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            rows: [],
            dimensions: [],
            activeDimensions: [],
            reduce: function (row, memo) {
                return memo
            },
            calculations: [],
            pieData: [],
            result: "",
            chartType: 'pie'
        }
    }

    componentWillMount() {
        Actions.loadStatistics();
        this.unsubscribe = StatisticsStore.listen(this._onStatisticsLoaded);
    };

    componentWillUnmount() {
        this.unsubscribe();
    };

    _onStatisticsLoaded = (data) => {
        this.setState(
            {
                width: 800
            }
        );

        if (data) {
            this.setState(
                {
                    rows: data.statistics.rows,
                    activeDimensions: data.statistics.activeDimensions,
                    dimensions: data.statistics.dimensions,
                    calculations: data.statistics.calculations,
                    reportKey: data.statistics.reportKey
                }
            );
        }
    };

    onData = (data) => {
        Logger.log('ONDATA: ' + data);
        var pieData = [];
        var sum = 0;

        var dimm = '';
        var singleValueSet = [];

        for (var d in data) {
            var i = 0;
            var dimmm = '';
            for (var dim in this.state.dimensions) {
                if (data[d][this.state.dimensions[dim].title]) {
                    dimmm = this.state.dimensions[dim].title;
                    i += 1;
                }
            }

            if (i == 1) {
                dimm = dimmm;
                singleValueSet.push(data[d]);
            }
        }

        for (var ddx in singleValueSet) {
            sum = sum + singleValueSet[ddx].count;
            pieData.push({label: singleValueSet[ddx][dimm], value: singleValueSet[ddx].count});
        }

        for (var d in pieData) {
            pieData[d].value = Math.round((pieData[d].value / sum * 100) * 100) / 100;
        }

        this.setState({pieData: pieData});
    };


    reduce = (row, memo) => {
        memo.count = (memo.count || 0) + parseFloat(row.count);
        return memo;
    };

    _onChartTypeSelect = (e) => {
        this.setState({chartType: e.target.value});
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
                onData={this.onData}
                //sortBy={this.state.calculations[0].title}
                sortDir='desc'/>
            <div className='row' style={{margin: '1em 0 0 0'}}>
                <div className='col-xs-3' style={{padding: '0 0 0 0'}}>
                    abcd
                    <Input type='select' title='Chart type' label='Chart type' value={this.state.chartType}
                           onChange={this._onChartTypeSelect}>
                        <option value='pie'>Pie chart</option>
                        <option value='tree'>Tree map</option>
                    </Input>
                </div>
            </div>
            {this.renderChart()}
        </div> );
    }

    renderChart() {
        if (this.state.chartType === 'pie') {
            return <PieChart
                data={this.state.pieData}
                width={this.state.width}
                height={800}
                radius={350}
                innerRadius={10}
                title={''}
                showTooltip={true}
                tooltipFormat={this.formatTooltip}
            />;
        }
        return <Treemap data={this.state.pieData} width={this.state.width} height={800}/>;
    }
}

// I18nWrapper => this.props.i18n

export default injectIntl(I18nWrapper(StatisticsSimple));
