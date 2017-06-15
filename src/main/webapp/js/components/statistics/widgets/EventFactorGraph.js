'use strict';
import React from "react";
import I18nWrapper from "../../../i18n/I18nWrapper";
import injectIntl from "../../../utils/injectIntl";
import StatisticsStore from "../../../stores/StatisticsStore";
import Actions from "../../../actions/Actions";
import Utils from "../Utils";
import Graph from "react-graph-vis";
import LoadingWrapper from "../../misc/hoc/LoadingWrapper";

class EventFactorGraph extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            data: {}
        }
    }

    componentWillMount() {
        this.props.loadingOn();
        Actions.loadStatistics("eventfactorgraph_rel");
        this.unsubscribe = StatisticsStore.listen(this._onStatisticsLoaded);
    };

    componentWillUnmount() {
        this.unsubscribe();
    };

    _onStatisticsLoaded = (data) => {
        if (data && ( data.queryName != "eventfactorgraph_rel")) {
            return;
        }

        if (data) {
            const rows = Utils.sparql2table(data.queryResults.results.bindings);

            //   ?event_type ?relation_type ?factor_type (COUNT(*) AS ?count)

            let nodes = []
            let edges = []

            let maxNode = 1

            const addNode = (event_type) => {
                let found = nodes.filter((item) => {
                    return (item.label == event_type)
                })
                let node;
                if (found.length == 1) {
                    node = found[0];
                    node.size = node.size + 1;
                    node.mass = node.mass + 1;
                    node.title = node.label + " ( "+(node.mass-5)+" )";
                } else {
                    node = {
                        id: maxNode++,
                        label: event_type,
                        shape: 'dot',
                        title: event_type + " ( 1 )",
                        mass: 5,
                        size: 5
                    }
                    nodes.push(node);
                }
                return node.id;
            }

            const addEdge = (from, to, relation_type, count) => {
                // let found = edges.filter((item) => {
                //     return (item.from == from) && (item.to == to) && (item.label == relation_type)
                // })
                let edge = {
                    arrowStrikethrough: false,
                    from: from,
                    to: to,
                    title: ""+count,
                    // label: relation_type,
                    value: count,
                    chosen: {
                        label: count
                    },
                    color: {
                        color: (relation_type == 'causes') ? 'rgb(255,153,153)' :
                            (relation_type == 'mitigates') ? 'rgb(153,255,153)' :
                                (relation_type == 'contributes to') ? 'rgb(255,204,153)' :
                                    'rgb(200,200,200)',
                        hover: (relation_type == 'causes') ? 'red' :
                            (relation_type == 'mitigates') ? 'green' :
                                (relation_type == 'contributes to') ? 'orange' :
                                    'black'
                    },
                    highlight: 'black',
                    // length: 1 / (count * count * count)
                }
                    edges.push(edge);
                // }
            }

            rows.forEach((item) => {
                if (item.factor_type && item.event_type) {
                    addEdge( addNode(item.factor_type), addNode(item.event_type), item.relation_type, item.count);
                }
            })

            // let nodeFiltered = [];
            // edges = edges.filter((edge) => { if ( edge.value > 5 ) {nodeFiltered.push(edge.from); nodeFiltered.push(edge.to); return true} else return false})
            // nodes = nodes.filter((node) => { return nodeFiltered.indexOf(node.id) >= 0});

            this.setState(
                {
                    data: {nodes, edges},
                }
            );
            this.props.loadingOff();
        }
    };

    render() {

        const options = {
                layout: {
                    randomSeed: 1,
                    improvedLayout: true,
                },
                physics: {
                    enabled: false,
                    //     barnesHut: {
                    //         avoidOverlap: 0.1
                    //     }
                },
                // configure: {
                //     enabled: true,
                //     filter: ["edges","layout", "interaction", "manipulation", "selection", "renderer", "physics"]
                // },
                interaction: {
                    hover: true,
                    multiselect: true,
                    selectConnectedEdges: true,
                    hoverConnectedEdges: true,
                    zoomView: true,
                    tooltipDelay: 300
                },
                edges: {
                    smooth: {
                        enabled: true,
                        type: 'continuous'
                    }
                },
                // autoResize: true,
        };

        const events = {
            // select: function (event) {
            //     const {nodes, edges} = event;
            // }
        }

        return <div><table style={{ width : '100%'}}><tbody><tr><td>Events</td><td><Graph graph={this.state.data} options={options} events={events} style={{ width : '100%', height:'600px' }}/>;</td></tr></tbody></table></div>;
    }
}

export default injectIntl(I18nWrapper(LoadingWrapper(EventFactorGraph, {maskClass: 'mask-container'})));