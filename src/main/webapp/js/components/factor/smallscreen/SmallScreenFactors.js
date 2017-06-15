'use strict';

import React from "react";
import {Button, Glyphicon, Panel, Table} from "react-bootstrap";
import assign from "object-assign";
import {QuestionAnswerProcessor} from "semforms";
import Actions from "../../../actions/Actions";
import Constants from "../../../constants/Constants";
import DeleteFactorDialog from "../DeleteFactorDialog";
import EventValidator from "../../../validation/EventValidator";
import FactorEditRow from "./FactorEditRow";
import FactorRow from "./FactorRow";
import I18nWrapper from "../../../i18n/I18nWrapper";
import injectIntl from "../../../utils/injectIntl";
import LoadingWrapper from "../../misc/hoc/LoadingWrapper";
import MessageWrapper from "../../misc/hoc/MessageWrapper";
import OptionsStore from "../../../stores/OptionsStore";
import ReportFactory from "../../../model/ReportFactory";
import Utils from "../../../utils/Utils";
import Vocabulary from "../../../constants/Vocabulary";
import WizardGenerator from "../../wizard/generator/WizardGenerator";
import WizardWindow from "../../wizard/WizardWindow";

class SmallScreenFactors extends React.Component {

    static propTypes = {
        report: React.PropTypes.object.isRequired,
        onChange: React.PropTypes.func.isRequired,
        rootAttribute: React.PropTypes.string.isRequired
    };

    constructor(props) {
        super(props);
        this.i18n = props.i18n;
        this.state = this._getInitialState(props.report);
    }

    _getInitialState(report) {
        return {
            showDeleteDialog: false,
            editRow: false,
            currentFactor: null,
            factorGraph: {
                nodes: report.factorGraph ? report.factorGraph.nodes.slice() : [report[this.props.rootAttribute]],
                edges: report.factorGraph ? report.factorGraph.edges : []
            },
            wizardOpen: false,
            wizardProperties: null
        };
    }

    componentDidMount() {
        this.unsubscribe = OptionsStore.listen(this._onOptionsLoaded);
        Actions.loadOptions(Constants.OPTIONS.EVENT_TYPE);
        if (OptionsStore.getOptions(Constants.OPTIONS.EVENT_TYPE).length === 0) {
            this.props.loadingOn();
        }
    }

    _onOptionsLoaded = (type) => {
        if (type === Constants.OPTIONS.EVENT_TYPE) {
            this.props.loadingOff();
            this.forceUpdate();
        }
    };

    componentWillUnmount() {
        this.unsubscribe();
    }

    componentDidUpdate(prevProps) {
        if (this.props.report !== prevProps.report) {
            this.setState(this._getInitialState(this.props.report));
        }
    }

    _onDeleteClick = (factor) => {
        this.setState({showDeleteDialog: true, currentFactor: factor});
    };

    _onDeleteCancel = () => {
        this.setState({showDeleteDialog: false, currentFactor: null});
    };

    _onDeleteSubmit = () => {
        const newFactorGraph = assign({}, this.state.factorGraph);
        newFactorGraph.nodes.splice(newFactorGraph.nodes.indexOf(this.state.currentFactor), 1);
        this.setState({factorGraph: newFactorGraph, currentFactor: null, showDeleteDialog: false});
    };

    _onEditClick = (factor) => {
        this.setState({editRow: true, currentFactor: factor});
    };

    _onEditCancel = () => {
        if (this.state.currentFactor.isNew) {
            this._onDeleteSubmit();
        }
        this.setState({editRow: false, currentFactor: null});
    };

    _onEditFinish = (factor) => {
        const validation = EventValidator.validate(factor);
        if (!validation.valid) {
            this.props.showWarnMessage(this.props.formatMessage(validation.message));
            return;
        }
        delete factor.isNew;

        const update = this._updateFactor(factor);
        update.editRow = false;
        this.setState(update);
    };

    _updateFactor(factor) {
        const newFactorGraph = assign({}, this.state.factorGraph),
            oldFactor = this.state.currentFactor;
        newFactorGraph.nodes.splice(newFactorGraph.nodes.indexOf(oldFactor), 1, factor);
        SmallScreenFactors._replaceEdgeNode(oldFactor, factor, newFactorGraph);
        SmallScreenFactors._updateParentTimespan(factor, newFactorGraph);
        SmallScreenFactors._updateChildrenTimespan(factor, newFactorGraph);
        if (newFactorGraph.nodes[0] !== this.props.report[this.props.rootAttribute]) {
            const change = {};
            change[this.props.rootAttribute] = newFactorGraph.nodes[0]; // The first node is always the root
            this.props.onChange(change);
        }
        return {factorGraph: newFactorGraph, currentFactor: null};
    }

    static _replaceEdgeNode(oldNode, newNode, factorGraph) {
        for (let i = 0, len = factorGraph.edges.length; i < len; i++) {
            if (factorGraph.edges[i].from === oldNode) {
                factorGraph.edges[i].from = newNode;
            } else if (factorGraph.edges[i].to === oldNode) {
                factorGraph.edges[i].to = newNode;
            }
        }
    }

    static _updateParentTimespan(factor, factorGraph) {
        const edges = factorGraph.edges,
            nodes = factorGraph.nodes;
        for (let i = 0, len = edges.length; i < len; i++) {
            if (edges[i].linkType === Vocabulary.HAS_PART && edges[i].to === factor) {
                if (edges[i].from.startTime > factor.startTime || edges[i].from.endTime < factor.endTime) {
                    const newNode = assign({}, edges[i].from);
                    newNode.startTime = factor.startTime < newNode.startTime ? factor.startTime : newNode.startTime;
                    newNode.endTime = factor.endTime > newNode.endTime ? factor.endTime : newNode.endTime;
                    nodes.splice(nodes.indexOf(edges[i].from), 1, newNode);
                    SmallScreenFactors._replaceEdgeNode(edges[i].from, newNode, factorGraph);
                    SmallScreenFactors._updateParentTimespan(newNode, factorGraph);
                    return;
                }
            }
        }
    };

    static _updateChildrenTimespan(factor, factorGraph) {
        const edges = factorGraph.edges,
            nodes = factorGraph.nodes;
        for (let i = 0, len = edges.length; i < len; i++) {
            if (edges[i].linkType === Vocabulary.HAS_PART && edges[i].from === factor) {
                if (edges[i].to.startTime < factor.startTime || edges[i].to.endTime > factor.endTime) {
                    const newNode = assign({}, edges[i].to);
                    newNode.startTime = factor.startTime > newNode.startTime ? factor.startTime : newNode.startTime;
                    newNode.endTime = factor.endTime < newNode.endTime ? factor.endTime : newNode.endTime;
                    nodes.splice(nodes.indexOf(edges[i].to), 1, newNode);
                    SmallScreenFactors._replaceEdgeNode(edges[i].to, newNode, factorGraph);
                    SmallScreenFactors._updateChildrenTimespan(newNode, factorGraph);
                }
            }
        }
    }

    _onAdd = () => {
        const rootNode = this.props.report[this.props.rootAttribute],
            newFactor = ReportFactory.createFactor(rootNode),
            newFactorGraph = {
                nodes: this.state.factorGraph.nodes.slice(),
                edges: this.state.factorGraph.edges.slice()
            };
        newFactor.referenceId = Utils.generateNewReferenceId(newFactorGraph.nodes);
        newFactor.isNew = true;
        newFactorGraph.nodes.push(newFactor);
        const newLink = {
            from: rootNode,
            to: newFactor,
            linkType: Vocabulary.HAS_PART
        };
        newFactorGraph.edges.push(newLink);
        this.setState({factorGraph: newFactorGraph, currentFactor: newFactor, editRow: true});
    };

    getFactorGraph() {
        return this.state.factorGraph;
    }

    _onOpenDetails = (factor, label) => {
        const report = assign({}, this.props.report);
        report.factorGraph = this.state.factorGraph;
        this.props.loadingOn();
        this.setState({currentFactor: factor});
        WizardGenerator.generateWizard(report, factor, label, this._openDetailsWizard);
    };

    _openDetailsWizard = (wizardProperties) => {
        this.props.loadingOff();
        wizardProperties.onFinish = this._onUpdateFactorDetails;
        this.setState({
            wizardOpen: true,
            wizardProperties: wizardProperties
        });
    };

    _onCloseDetails = () => {
        this.setState({wizardOpen: false});
    };

    _onUpdateFactorDetails = (data, closeCallback) => {
        const factor = assign({}, this.state.currentFactor);

        factor.question = QuestionAnswerProcessor.buildQuestionAnswerModel(data.data, data.stepData);
        const update = this._updateFactor(factor);
        this.setState({update});
        closeCallback();
    };

    render() {
        const table = this._renderTable();
        return <Panel header={<h5>{this.i18n('factors.panel-title')}</h5>} bsStyle='info'>
            <DeleteFactorDialog onSubmit={this._onDeleteSubmit} onCancel={this._onDeleteCancel}
                                show={this.state.showDeleteDialog}/>
            <WizardWindow {...this.state.wizardProperties} show={this.state.wizardOpen} onHide={this._onCloseDetails}
                          enableForwardSkip={true}/>
            {table}
            <div className={table ? 'float-right' : ''}>
                <Button bsStyle='primary' bsSize='small' onClick={this._onAdd}
                        title={this.props.i18n('factors.smallscreen.add-tooltip')}>
                    <Glyphicon glyph='plus' className='add-glyph'/>
                    {this.props.i18n('add')}
                </Button>
            </div>
        </Panel>;
    }

    _renderTable() {
        return this.state.factorGraph.nodes.length <= 1 ? null : <Table striped bordered condensed hover>
                <thead>
                <tr>
                    <th className='content-center col-xs-4'>{this.i18n('report.eventtype.table-type')}</th>
                    <th className='content-center col-xs-3'>{this.i18n('factors.smallscreen.start')}</th>
                    <th className='content-center col-xs-3'>{this.i18n('factors.smallscreen.end')}</th>
                    <th className='content-center col-xw-2'>{this.i18n('table-actions')}</th>
                </tr>
                </thead>
                <tbody>
                {this._renderFactors()}
                </tbody>
            </Table>;
    }

    _renderFactors() {
        const factorGraph = this.state.factorGraph,
            rows = [],
            eventTypes = OptionsStore.getOptions(Constants.OPTIONS.EVENT_TYPE),
            handlers = {
                onDelete: this._onDeleteClick,
                onEdit: this._onEditClick,
                onEditCancel: this._onEditCancel,
                onSave: this._onEditFinish,
                onDetails: this._onOpenDetails
            };
        let node;
        // Skip node 0 - the root node
        for (let i = 1, len = factorGraph.nodes.length; i < len; i++) {
            node = factorGraph.nodes[i];
            if (this.state.editRow && node === this.state.currentFactor) {
                rows.push(<FactorEditRow key={node.uri ? node.uri : 'node_' + i} factor={node} handlers={handlers}/>);
            } else {
                rows.push(<FactorRow key={node.uri ? node.uri : 'node_' + i} node={node} eventTypes={eventTypes}
                                     handlers={handlers}/>);
            }
        }
        return rows;
    }
}

export default injectIntl(I18nWrapper(MessageWrapper(LoadingWrapper(SmallScreenFactors, {maskClass: 'mask-container'}))), {withRef: true});
