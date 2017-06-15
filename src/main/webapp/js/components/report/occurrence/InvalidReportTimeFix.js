'use strict';

import React from "react";
import {Button, ButtonToolbar, Panel, Table} from "react-bootstrap";
import DateTimePicker from "react-bootstrap-datetimepicker";
import {FormattedMessage} from "react-intl";
import assign from "object-assign";
import JsonLdUtils from "jsonld-utils";
import Actions from "../../../actions/Actions";
import Constants from "../../../constants/Constants";
import I18nWrapper from "../../../i18n/I18nWrapper";
import injectIntl from "../../../utils/injectIntl";
import ObjectTypeResolver from "../../../utils/ObjectTypeResolver";
import OptionsStore from "../../../stores/OptionsStore";
import Utils from "../../../utils/Utils";
import Vocabulary from "../../../constants/Vocabulary";

class InvalidReportTimeFix extends React.Component {
    static propTypes = {
        report: React.PropTypes.object.isRequired,
        onChange: React.PropTypes.func.isRequired,
        onFinish: React.PropTypes.func.isRequired
    };

    constructor(props) {
        super(props);
        this.i18n = props.i18n;
    }

    componentDidMount() {
        Actions.loadOptions(Constants.OPTIONS.EVENT_TYPE);
        this.unsubscribe = OptionsStore.listen(this._onOptionsLoaded);
    }

    componentWillUnmount() {
        this.unsubscribe();
    }

    _onOptionsLoaded = (type) => {
        if (type === Constants.OPTIONS.EVENT_TYPE) {
            this.forceUpdate();
        }
    };

    _onStartChange = (instance, value) => {
        if (isNaN(value)) {
            return;
        }
        const clone = assign({}, instance);
        clone.startTime = Number(value);
        this._propagateChange(instance, clone);
    };

    _propagateChange(original, clone) {
        const report = this.props.report;
        if (report.occurrence === original) {
            this.props.onChange({occurrence: clone});
        }
        if (report.factorGraph) {
            const nodes = report.factorGraph.nodes.slice();
            nodes.splice(nodes.indexOf(original), 1, clone);
            const newFactorGraph = assign({}, report.factorGraph);
            newFactorGraph.nodes = nodes;
            this._propagateChangeToFactorGraphEdges(newFactorGraph, original, clone);
            this.props.onChange({factorGraph: newFactorGraph});
        }
    }

    _propagateChangeToFactorGraphEdges(factorGraph, original, clone) {
        factorGraph.edges = factorGraph.edges.slice();
        for (let i = 0, len = factorGraph.edges.length; i < len; i++) {
            const edge = factorGraph.edges[i];
            if (edge.from === original) {
                const newEdge = assign({}, edge);
                newEdge.from = clone;
                factorGraph.edges.splice(i, 1, newEdge);
            }
            if (edge.to === original) {
                const newEdge = assign({}, edge);
                newEdge.to = clone;
                factorGraph.edges.splice(i, 1, newEdge);
            }
        }
    }

    _onEndChange = (instance, value) => {
        if (isNaN(value)) {
            return;
        }
        const clone = assign({}, instance);
        clone.endTime = Number(value);
        this._propagateChange(instance, clone);
    };

    render() {
        const report = this.props.report;
        return <Panel header={<h5>{this.i18n('detail.fix.title')}</h5>} bsStyle='primary'>
            <Table striped bordered condensed hover>
                <thead>
                <tr>
                    <th className='col-xs-6'>{this.i18n('occurrencereport.label') + '/' + this.i18n('factors.event.label')}</th>
                    <th className='col-xs-3'>{this.i18n('detail.fix.start-time')}</th>
                    <th className='col-xs-3'>{this.i18n('detail.fix.end-time')}</th>
                </tr>
                </thead>
                <tbody>
                <tr>
                    <td>{report.occurrence.name}</td>
                    <td className='picker-container'>
                        <DateTimePicker inputFormat='DD-MM-YYYY HH:mm:ss'
                                        dateTime={report.occurrence.startTime.toString()}
                                        onChange={(value) => this._onStartChange(report.occurrence, value)}
                                        size='small'/>
                    </td>
                    <td className='picker-container'>
                        <DateTimePicker inputFormat='DD-MM-YYYY HH:mm:ss'
                                        dateTime={report.occurrence.endTime.toString()}
                                        onChange={(value) => this._onEndChange(report.occurrence, value)} size='small'/>
                    </td>
                </tr>
                {this._renderEvents()}
                </tbody>
            </Table>
            <div className='notice-small'>
                <FormattedMessage id='detail.fix.time-diff-hint'
                                  values={{value: Utils.convertTime('second', 'hour', Constants.MAX_OCCURRENCE_START_END_DIFF / 1000)}}/>
            </div>
            <ButtonToolbar className='float-right'>
                <Button bsSize='small' bsStyle='primary' title={this.i18n('detail.fix.done.tooltip')}
                        onClick={this.props.onFinish}>
                    {this.i18n('detail.fix.done')}
                </Button>
            </ButtonToolbar>
        </Panel>;
    }

    _renderEvents() {
        const events = this.props.report.factorGraph ? this.props.report.factorGraph.nodes : [],
            rows = [];
        // Start from one, the first is the occurrence
        for (let i = 1, len = events.length; i < len; i++) {
            const typeName = ObjectTypeResolver.resolveType(events[i].eventType, OptionsStore.getOptions(Constants.OPTIONS.EVENT_TYPE));
            rows.push(<tr key={events[i].uri}>
                <td>{typeName !== null ? JsonLdUtils.getLocalized(typeName[Vocabulary.RDFS_LABEL], this.props.intl) : events[i].eventType}</td>
                <td className='picker-container'>
                    <DateTimePicker inputFormat='DD-MM-YYYY HH:mm:ss' dateTime={events[i].startTime.toString()}
                                    onChange={(value) => this._onStartChange(events[i], value)} size='small'/>
                </td>
                <td className='picker-container'>
                    <DateTimePicker inputFormat='DD-MM-YYYY HH:mm:ss' dateTime={events[i].endTime.toString()}
                                    onChange={(value) => this._onEndChange(events[i], value)} size='small'/>
                </td>
            </tr>);
        }
        return rows;
    }
}

export default injectIntl(I18nWrapper(InvalidReportTimeFix));
