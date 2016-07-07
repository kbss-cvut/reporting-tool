/**
 * @jsx
 */

'use strict';

var React = require('react');
var Reflux = require('reflux');
var assign = require('object-assign');
var Button = require('react-bootstrap').Button;
var Modal = require('react-bootstrap').Modal;
var Panel = require('react-bootstrap').Panel;
var injectIntl = require('../../utils/injectIntl');
var FormattedMessage = require('react-intl').FormattedMessage;

var Input = require('../Input');
var Select = require('../Select');

var Actions = require('../../actions/Actions');
var FactorDetail = require('./FactorDetail');
var FactorRenderer = require('./FactorRenderer');
var GanttController = require('./GanttController');
var FactorJsonSerializer = require('../../utils/FactorJsonSerializer');
var I18nMixin = require('../../i18n/I18nMixin');
var Utils = require('../../utils/Utils');

var OptionsStore = require('../../stores/OptionsStore');
var TypeaheadStore = require('../../stores/TypeaheadStore');

// TODO We should get rid of references to report.occurrence, because factors will be used also in Safety issue reports
// and possibly audit reports
var Factors = React.createClass({
    mixins: [I18nMixin, Reflux.listenTo(TypeaheadStore, 'renderFactors'), Reflux.listenTo(OptionsStore, '_factorTypesLoaded')],

    propTypes: {
        report: React.PropTypes.object.isRequired
    },

    ganttController: null,
    factorReferenceIdCounter: 0,

    getInitialState: function () {
        return {
            scale: 'second',
            showLinkTypeDialog: false,
            currentLink: null,
            currentLinkSource: null,
            currentLinkTarget: null,
            showFactorDialog: false,
            currentFactor: null,
            factorTypeOptions: Utils.processSelectOptions(OptionsStore.getOptions('factorType')),
            showDeleteLinkDialog: false
        }
    },

    componentDidUpdate: function () {
        if (this.factorsRendered) {
            this.ganttController.updateOccurrenceEvent(this.props.report);
        }
    },

    componentWillMount: function () {
        Actions.loadEventTypes();
    },

    componentDidMount: function () {
        this.ganttController = GanttController;
        this.ganttController.init({
            onLinkAdded: this.onLinkAdded,
            onCreateFactor: this.onCreateFactor,
            onEditFactor: this.onEditFactor,
            updateOccurrence: this.onUpdateOccurrence,
            onDeleteLink: this.onDeleteLink
        });
        this.ganttController.setScale(this.state.scale);
        if (TypeaheadStore.getEventTypes().length !== 0) {
            this.renderFactors();
        }
    },

    _factorTypesLoaded: function (type, data) {
        if (type === 'factorType') {
            this.setState({factorTypeOptions: Utils.processSelectOptions(data)});
        }
    },

    renderFactors: function (data) {
        if (this.factorsRendered) {
            return;
        }
        if (data && data.action !== Actions.loadEventTypes) {
            return;
        }
        this.factorsRendered = true;
        FactorRenderer.renderFactors(this.props.report, TypeaheadStore.getEventTypes());
        this.ganttController.expandSubtree(this.ganttController.occurrenceEventId);
        this.factorReferenceIdCounter = FactorRenderer.greatestReferenceId;
    },

    onLinkAdded: function (link) {
        this.setState({currentLink: link, showLinkTypeDialog: true});
    },

    onLinkTypeSelect: function (e) {
        var link = this.state.currentLink;
        link.factorType = e.target.value;
        this.ganttController.addLink(link);
        this.onCloseLinkTypeDialog();
    },

    onCloseLinkTypeDialog: function () {
        this.setState({currentLink: null, showLinkTypeDialog: false});
    },

    onCreateFactor: function (factor) {
        factor.statement.referenceId = ++this.factorReferenceIdCounter;
        this.setState({showFactorDialog: true, currentFactor: factor});
    },

    onEditFactor: function (factor) {
        this.setState({currentFactor: factor, showFactorDialog: true});
    },

    onSaveFactor: function () {
        var factor = this.state.currentFactor;
        if (factor.isNew) {
            delete factor.isNew;
            if (factor.parent) {
                factor.statement.index = this.ganttController.getChildCount(factor.parent);
            }
            factor.id = factor.statement.referenceId;
            this.ganttController.addFactor(factor, factor.parent);
        } else {
            this.ganttController.updateFactor(factor);
        }
        this.onCloseFactorDialog();
    },

    onDeleteFactor: function () {
        var factor = this.state.currentFactor;
        this.ganttController.deleteFactor(factor.id);
        this.onCloseFactorDialog();
    },

    onCloseFactorDialog: function () {
        this.setState({currentFactor: null, showFactorDialog: false});
    },

    onDeleteLink: function (link, source, target) {
        this.setState({
            showDeleteLinkDialog: true,
            currentLink: link,
            currentLinkSource: source,
            currentLinkTarget: target
        })
    },

    onCloseDeleteLinkDialog: function () {
        this.setState({showDeleteLinkDialog: false, currentLink: null});
    },

    deleteLink: function () {
        this.ganttController.deleteLink(this.state.currentLink.id);
        this.onCloseDeleteLinkDialog();
    },

    onScaleChange: function (e) {
        var scale = e.target.value;
        this.setState({scale: scale});
        this.ganttController.setScale(scale);
    },

    onUpdateOccurrence: function (startTime, endTime) {
        var occurrence = assign({}, this.props.report.occurrence);
        occurrence.startTime = startTime;
        occurrence.endTime = endTime;
        this.props.onChange({'occurrence': occurrence});
    },

    getFactorGraph: function () {
        FactorJsonSerializer.setGanttController(this.ganttController);
        return FactorJsonSerializer.getFactorGraph(this.props.report);
    },

    getReport: function () {
        var report = assign({}, this.props.report);
        report.factorGraph = this.getFactorGraph();
        return report;
    },


    render: function () {
        var scaleTooltip = this.i18n('factors.scale-tooltip');
        return (
            <Panel header={<h5>{this.i18n('factors.panel-title')}</h5>} bsStyle='info'>
                {this.renderFactorDetailDialog()}
                {this.renderLinkTypeDialog()}
                {this.renderDeleteLinkDialog()}
                <div id='factors_gantt' className='factors-gantt'/>
                <div className='gantt-zoom'>
                    <div className='col-xs-5'>
                        <div className='col-xs-2 gantt-zoom-label bold'>{this.i18n('factors.scale')}:</div>
                        <div className='col-xs-2'>
                            <Input type='radio' label={this.i18n('factors.scale.second')} value='second'
                                   title={scaleTooltip + 'seconds'} checked={this.state.scale === 'second'}
                                   onChange={this.onScaleChange}/>
                        </div>
                        <div className='col-xs-2'>
                            <Input type='radio' label={this.i18n('factors.scale.minute')} value='minute'
                                   title={scaleTooltip + 'minutes'}
                                   checked={this.state.scale === 'minute'}
                                   onChange={this.onScaleChange}/>
                        </div>
                        <div className='col-xs-2'>
                            <Input type='radio' label={this.i18n('factors.scale.hour')} value='hour'
                                   title={scaleTooltip + 'hours'}
                                   checked={this.state.scale === 'hour'} onChange={this.onScaleChange}/>
                        </div>
                        <div className='col-xs-2'>
                            <Input type='radio' label={this.i18n('factors.scale.relative')} value='relative'
                                   title={this.i18n('factors.scale.relative-tooltip')}
                                   checked={this.state.scale === 'relative'} onChange={this.onScaleChange}/>
                        </div>
                    </div>

                    <div className='col-xs-2'>&nbsp;</div>

                    <div className='col-xs-5 gantt-zoom-label'>
                        {this._renderLineColors()}
                    </div>
                </div>
            </Panel>);
    },

    renderFactorDetailDialog: function () {
        if (!this.state.showFactorDialog) {
            return null;
        }
        return <FactorDetail show={this.state.showFactorDialog} getReport={this.getReport}
                              factor={this.state.currentFactor} onClose={this.onCloseFactorDialog}
                              onSave={this.onSaveFactor} onDelete={this.onDeleteFactor} scale={this.state.scale}/>;
    },

    renderLinkTypeDialog: function () {
        return (
            <Modal show={this.state.showLinkTypeDialog} bsSize='small' onHide={this.onCloseLinkTypeDialog}>
                <Modal.Header closeButton>
                    <Modal.Title>{this.i18n('factors.link-type-select')}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Select ref='linkType' title={this.i18n('factors.link-type-select-tooltip')} addDefault={true}
                            onChange={this.onLinkTypeSelect} options={this.state.factorTypeOptions}/>
                </Modal.Body>
            </Modal>
        );
    },

    renderDeleteLinkDialog: function () {
        var source = this.state.currentLinkSource ? this.state.currentLinkSource.text : '',
            target = this.state.currentLinkTarget ? this.state.currentLinkTarget.text : '';
        return (
            <Modal show={this.state.showDeleteLinkDialog} bsSize='small' onHide={this.onCloseDeleteLinkDialog}>
                <Modal.Header closeButton>
                    <Modal.Title>{this.i18n('factors.link.delete.title')}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <FormattedMessage id='factors.link.delete.text'
                                      values={{source: <span className='bold'>{source}</span>, target: <span className='bold'>{target}</span>}}/>
                </Modal.Body>
                <Modal.Footer>
                    <Button bsStyle='warning' bsSize='small' onClick={this.deleteLink}>{this.i18n('delete')}</Button>
                    <Button bsSize='small' onClick={this.onCloseDeleteLinkDialog}>{this.i18n('cancel')}</Button>
                </Modal.Footer>
            </Modal>
        );
    },

    _renderLineColors: function () {
        var size = 12 / this.state.factorTypeOptions.length;
        return this.state.factorTypeOptions.map((item) => {
            var simpleName = Utils.getLastPathFragment(item.value);
            return <div className={'col-xs-' + size} key={item.value}>
                <div className={'gantt-link-' + simpleName}
                     style={{height: '4px', width: '2em', float: 'left', margin: '8px'}}/>
                <div style={{float: 'left'}}>{item.label}</div>
            </div>;
        });
    }
});

module.exports = injectIntl(Factors, {withRef: true});
