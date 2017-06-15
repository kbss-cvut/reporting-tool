'use strict';
import React from "react";
import FrequencyList from "./FrequencyList";
import EventtypeGraph from "./EventtypeGraph";
import StatisticsStore from "../../../stores/StatisticsStore";
import Actions from "../../../actions/Actions";
import LoadingWrapper from "../../misc/hoc/LoadingWrapper";

class EventtypeDashboard extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            eventLabel : null,
            selectedQueryResults: null
        }
    }

    onSelect(id) {
        Actions.loadStatistics("eventfactorcontext", {central_type: id});
        this.unsubscribe = StatisticsStore.listen(this._onStatisticsLoaded);
    }

    _onStatisticsLoaded = (data) => {
        if (data && ( data.queryName != "eventfactorcontext")) {
            return;
        }


        if (data) {
            this.setState(
                {
                    selectedQueryResults: data.queryResults.results.bindings
                }
            );
        }
    }

    render() {
        return <table style={{width: '100%', height:'700px'}}>
            <tbody>
            <tr>
                <td className="col-xs-4 vtop">
                    <FrequencyList query="events_top_yearback" allowZeros={true} onSelect={(data) => this.onSelect(data)}
                                   loadingOn={this.props.loadingOn} loadingOff={this.props.loadingOff}/>
                </td>

                <td className='col-xs-8 vtop'>
                    <EventtypeGraph eventTypeGraph={this.state.selectedQueryResults} loadingOn={this.props.loadingOn}
                                    loadingOff={this.props.loadingOff}/>
                </td>
            </tr>
            </tbody>
        </table>;
    }
}

export default LoadingWrapper(EventtypeDashboard, {maskClass: 'mask-container'});
