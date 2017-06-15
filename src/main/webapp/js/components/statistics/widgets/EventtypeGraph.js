'use strict';
import React from "react";
import I18nWrapper from "../../../i18n/I18nWrapper";
import injectIntl from "../../../utils/injectIntl";
import Utils from "../Utils";
import Graph from "react-graph-vis";
import LoadingWrapper from "../../misc/hoc/LoadingWrapper";

class EventtypeGraph extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            data: {},
            graphOptions: {
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
                configure: {
                    enabled: true,
                    filter: (option,path) => {
                        if ( path.indexOf('layout') !== -1 ) {
                            if (
                                (path.length == 1)
                                || (option == 'enabled')
                                || (option == 'levelSeparation')
                                || (option == 'treeSpacing')
                                || (option == 'direction')
                            ) {
                                return true;
                            } else {
                                return false;
                            }
                        }
                        return false;
                    },//, "edges","interaction", "manipulation", "selection", "renderer", "physics"]
                    showButton: false
                },

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
            }
        }
    }

     load() {
        if (this.props.eventTypeGraph) {
            const rows = Utils.sparql2table(this.props.eventTypeGraph);

            //   ?event_type ?relation_type ?factor_type (COUNT(*) AS ?count)

            let nodes = []
            let edges = []

            let maxNode = 1

            let fromToCount={};

            const addNode = (event_type) => {
                let found = nodes.filter((item) => {
                    return (item.label == event_type)
                })
                let node;
                if (found.length == 1) {
                    node = found[0];
                    node.size = node.size + 1;
                    node.mass = node.mass + 1;
                    node.title = node.label + " ( "+node.mass+" )";
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
                let x = fromToCount[from+to];
                if (!x) {
                    x = 0;
                }

                let y = ( ( x == 0 ) ? ( x ) :( (x % 2) - 0.5) );

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
                    smooth: {
                        enabled: true,
                        type: 'curvedCW',
                        roundness: y
                    }
                    // length: 1 / (count * count * count)
                }
                fromToCount[from+to] = x+1;
                edges.push(edge);
                // }
            }

            rows.forEach((item) => {
                let ft,et;
                if (item.factor_type) {
                    ft = addNode(item.factor_type)
                }

                if (item.event_type) {
                    et = addNode(item.event_type)
                }

                if (et && ft) {
                    addEdge(addNode(item.factor_type), addNode(item.event_type), item.relation_type, item.count);
                }
            });

            // let nodeFiltered = [];
            // edges = edges.filter((edge) => { if ( edge.value > 5 ) {nodeFiltered.push(edge.from); nodeFiltered.push(edge.to); return true} else return false})
            // nodes = nodes.filter((node) => { return nodeFiltered.indexOf(node.id) >= 0});

            return {nodes, edges};
        } else {
            return null;

        }
    };

    render() {
        const data = this.load();

        if ( data == null) {
            return <div style={{ textAlign: "center", verticalAlign:"center"}}>No Graph Available. Select an Event Type.</div>;
        } else {
            return <div>{this.props.title}<br/><Graph graph={data} options={this.state.graphOptions} style={{ width : '100%', height:'400px'}}/></div>;
        }
    }
}

export default injectIntl(I18nWrapper(LoadingWrapper(EventtypeGraph, {maskClass: 'mask-container'})));