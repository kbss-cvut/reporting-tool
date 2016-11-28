'use strict';

var QuestionAnswerProcessor = require('semforms').QuestionAnswerProcessor;

var React = require('react');
var assign = require('object-assign');
var classNames = require('classnames');
var Modal = require('react-bootstrap').Modal;
var Button = require('react-bootstrap').Button;
var ControlLabel = require('react-bootstrap').ControlLabel;
var Form = require('react-bootstrap').Form;
var Glyphicon = require('react-bootstrap').Glyphicon;
var Label = require('react-bootstrap').Label;
var FormGroup = require('react-bootstrap').FormGroup;
var InputGroup = require('react-bootstrap').InputGroup;
var FormControl = require('react-bootstrap').FormControl;
// require().default is needed for default-exported components using the ES6 syntax
var DateTimePicker = require('kbss-react-bootstrap-datetimepicker').default;
var injectIntl = require('../../utils/injectIntl');
var FormattedMessage = require('react-intl').FormattedMessage;
var JsonLdUtils = require('jsonld-utils').default;

var Constants = require('../../constants/Constants');
var EventTypeTypeahead = require('../typeahead/EventTypeTypeahead');
var Mask = require('../Mask').default;
var Utils = require('../../utils/Utils');
var FactorStyleInfo = require('../../utils/FactorStyleInfo');
var ExternalLink = require('../misc/ExternalLink').default;
var Vocabulary = require('../../constants/Vocabulary');

var WizardGenerator = require('../wizard/generator/WizardGenerator');
var WizardWindow = require('../wizard/WizardWindow');
var I18nMixin = require('../../i18n/I18nMixin');
var ObjectTypeResolver = require('../../utils/ObjectTypeResolver');
var OptionsStore = require('../../stores/OptionsStore');

function convertDurationToCurrentUnit(factor) {
    var targetUnit = gantt.config.duration_unit;
    return Utils.convertTime(factor.durationUnit, targetUnit, factor.duration);
}

var FactorDetail = React.createClass({
    mixins: [I18nMixin],

    propTypes: {
        onSave: React.PropTypes.func.isRequired,
        onClose: React.PropTypes.func.isRequired,
        onDelete: React.PropTypes.func.isRequired,
        scale: React.PropTypes.string.isRequired,
        factor: React.PropTypes.object.isRequired,
        getReport: React.PropTypes.func.isRequired,
        enableDetails: React.PropTypes.bool
    },

    getDefaultProps: function () {
        return {
            enableDetails: true
        };
    },

    getInitialState: function () {
        var factor = this.props.factor;
        return {
            showDeleteDialog: false,
            eventType: JsonLdUtils.jsonLdToTypeaheadOption(ObjectTypeResolver.resolveType(factor.statement.eventType, OptionsStore.getOptions('eventType'))),
            startDate: factor.start_date.getTime(),
            duration: convertDurationToCurrentUnit(factor),
            statement: factor.statement,

            isWizardOpen: false,
            wizardProperties: null,
            showMask: false
        };
    },

    onDeleteClick: function () {
        this.setState({showDeleteDialog: true});
    },

    onDeleteFactor: function () {
        this.setState({showDeleteDialog: false});
        this.props.onDelete();
    },

    onCancelDelete: function () {
        this.setState({showDeleteDialog: false});
    },

    onDurationMinus: function () {
        this.setState({duration: this.state.duration - 1});
    },

    onDurationPlus: function () {
        this.setState({duration: this.state.duration + 1});
    },

    onDurationSet: function (e) {
        var duration = Number(e.target.value);
        if (isNaN(duration) || duration < 0) {
            return;
        }
        this.setState({duration: duration});
    },

    onEventTypeChange: function (option) {
        this.setState({eventType: option});
    },

    onDateChange: function (date) {
        this.setState({startDate: Number(date)});
    },

    onOpenDetails: function () {
        this.setState({showMask: true});
        var report = this.props.getReport(),
            event = assign({}, this.state.statement);
        this._updateReportForFormGen(report);
        this._mergeStatementState(event);
        WizardGenerator.generateWizard(report, event, this.props.factor.text, this.openDetailsWizard);
    },

    /**
     * If the edited event is an existing one, merges the current state into it, so that the form generator works with
     * latest data.
     *
     * If the event is a new one, adds it to the factor graph with an edge to its parent.
     * @private
     */
    _updateReportForFormGen: function (report) {
        var nodes = report.factorGraph.nodes,
            item;
        for (var i = 0, len = nodes.length; i < len; i++) {
            if (nodes[i] === this.state.statement.referenceId || (nodes[i].referenceId && nodes[i].referenceId === this.state.statement.referenceId)) {
                item = nodes[i];
                break;
            }
        }
        if (!item) {
            item = this.state.statement;
            nodes.push(item);
            report.factorGraph.edges.push({
                from: Number(this.props.factor.parent),
                to: item.referenceId,
                linkType: Vocabulary.HAS_PART
            });
        }
        this._mergeStatementState(item);

    },

    openDetailsWizard: function (wizardProperties) {
        wizardProperties.onFinish = this.onUpdateFactorDetails;
        this.setState({
            showMask: false,
            isWizardOpen: true,
            wizardProperties: wizardProperties
        });
    },

    onCloseDetails: function () {
        this.setState({isWizardOpen: false});
    },

    onUpdateFactorDetails: function (data, closeCallback) {
        var statement = assign({}, this.state.statement);

        statement.question = QuestionAnswerProcessor.buildQuestionAnswerModel(data.data, data.stepData);
        this.setState({statement: statement});
        closeCallback();
    },

    onSave: function () {
        var factor = this.props.factor;
        factor.statement = this.state.statement ? this.state.statement : {};
        factor.text = this.state.eventType.name;
        this._mergeStatementState(factor.statement);
        factor.start_date = new Date(factor.statement.startTime);
        factor.end_date = new Date(factor.statement.endTime);
        this.props.onSave();
    },

    _mergeStatementState(statement) {
        statement.eventType = this.state.eventType.id;
        statement.startTime = this.state.startDate;
        statement.endTime = gantt.calculateEndDate(new Date(statement.startTime), this.state.duration, gantt.config.duration_unit).getTime();
        statement.question = this.state.statement.question;
    },


    render: function () {
        var eventTypeLabel = this.props.factor.text,
            eventTypeBadge = this.renderFactorTypeIcon(),
            eventTypeClassNames = classNames({
                'col-xs-12': !this.state.eventType,
                'col-xs-11': this.state.eventType,
                'col-xs-10': this.state.eventType && eventTypeBadge
            });

        // Modal body is given ref so that it is accessible in tests. See
        // https://github.com/react-bootstrap/react-bootstrap/issues/966
        return <div>
            <WizardWindow {...this.state.wizardProperties} show={this.state.isWizardOpen}
                          onHide={this.onCloseDetails} enableForwardSkip={true}/>
            <Modal show={this.props.show} onHide={this.props.onClose}>
                <Modal.Header closeButton>
                    <Modal.Title>{this.i18n('factors.detail.title')}</Modal.Title>
                </Modal.Header>

                <Modal.Body ref={comp => this._modalContent = comp}>
                    {this._renderMask()}
                    {this.renderDeleteDialog()}
                    <div className='row'>
                        {eventTypeBadge}
                        <div className={eventTypeClassNames}>
                            <EventTypeTypeahead placeholder={this.i18n('factors.detail.type-placeholder')}
                                                value={eventTypeLabel}
                                                label={this.i18n('factors.detail.type')}
                                                onSelect={this.onEventTypeChange} focus={true}/>
                        </div>
                        {this._renderEventTypeLink()}
                    </div>
                    <div>
                        <div>
                            <label className='control-label'>{this.i18n('factors.detail.time-period')}</label>
                        </div>
                        <div className='row'>
                            <Form inline>
                                {this._renderStartTimePicker()}
                                <div className='col-xs-7'>
                                    <div className='col-xs-9'>
                                        <FormGroup bsSize='small'>
                                            <ControlLabel>{this.i18n('factors.detail.duration')}</ControlLabel>
                                            <InputGroup className='inline-input'>
                                                <InputGroup.Button>
                                                    <Button bsSize='small' disabled={this.state.duration === 0}
                                                            onClick={this.onDurationMinus}><Glyphicon
                                                        glyph='minus'/></Button>
                                                </InputGroup.Button>
                                                <FormControl type='text' value={this.state.duration}
                                                             onChange={this.onDurationSet} size={3}/>
                                                <InputGroup.Button>
                                                    <Button bsSize='small' onClick={this.onDurationPlus}><Glyphicon
                                                        glyph='plus'/></Button>
                                                </InputGroup.Button>
                                            </InputGroup>
                                        </FormGroup>
                                    </div>
                                    <div className='col-xs-3' style={{padding: '7px 0 7px 0'}}>
                                        {this.renderDuration()}
                                    </div>
                                </div>
                            </Form>
                        </div>
                    </div>
                </Modal.Body>

                <Modal.Footer>
                    <Button bsSize='small' bsStyle='success' onClick={this.onSave}
                            disabled={!this.state.eventType}>{this.i18n('save')}</Button>
                    <Button bsSize='small' onClick={this.props.onClose}>{this.i18n('cancel')}</Button>
                    {this.renderDeleteButton()}
                    {this.renderWizardButton()}
                </Modal.Footer>
            </Modal>
        </div>;
    },

    _renderMask: function () {
        return this.state.showMask ? <Mask text={this.i18n('factors.detail.wizard-loading')}/> : null;
    },

    renderFactorTypeIcon: function () {
        var type = this.state.eventType,
            styleInfo;
        if (!type) {
            return null;
        }
        styleInfo = FactorStyleInfo.getStyleInfo(type.type);
        return styleInfo.value ? <div className='col-xs-1'>
            <Label bsStyle={styleInfo.bsStyle} title={styleInfo.title}
                   className='event-type-label'>{styleInfo.value}</Label>
        </div> : null;
    },

    _renderEventTypeLink: function () {
        var et = this.state.eventType;
        return et ?
            <div className='external-link-container'>
                <ExternalLink url={et.id} title={et.name + '\n' + et.id} className='external-link'/>
            </div> : null;
    },

    _renderStartTimePicker: function () {
        if (this.props.scale === Constants.TIME_SCALES.RELATIVE) {
            return null;
        }
        return <div className='col-xs-5'>
            <DateTimePicker inputFormat='DD-MM-YY HH:mm'
                            dateTime={this.state.startDate.toString()}
                            label={this.i18n('factors.detail.start')}
                            onChange={this.onDateChange} size='small'
                            inputProps={{
                                title: this.i18n('occurrence.start-time-tooltip'),
                                className: 'inline-input',
                                size: 12
                            }}/>
        </div>;
    },

    renderDuration: function () {
        var durations = {
            'second': <FormattedMessage id='factors.duration.second' values={{duration: this.state.duration}}/>,
            'minute': <FormattedMessage id='factors.duration.minute' values={{duration: this.state.duration}}/>,
            'hour': <FormattedMessage id='factors.duration.hour' values={{duration: this.state.duration}}/>
        };
        return durations[this.props.scale];
    },

    renderDeleteButton: function () {
        return this.props.factor.isNew ? null : (
            <Button bsSize='small' bsStyle='warning' onClick={this.onDeleteClick}>{this.i18n('delete')}</Button>);
    },

    renderWizardButton: function () {
        if (!this.props.enableDetails) {
            return null;
        }
        return <div style={{float: 'left'}}>
            <Button bsStyle='primary' bsSize='small' onClick={this.onOpenDetails}
                    disabled={!this.state.eventType}>{this.i18n('factors.detail.details')}</Button>
        </div>;
    },

    renderDeleteDialog: function () {
        return <Modal show={this.state.showDeleteDialog} onHide={this.onCancelDelete}>
            <Modal.Header>
                <Modal.Title>{this.i18n('factors.detail.delete.title')}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {this.i18n('factors.detail.delete.text')}
            </Modal.Body>
            <Modal.Footer>
                <Button bsSize='small' bsStyle='warning'
                        onClick={this.onDeleteFactor}>{this.i18n('delete')}</Button>
                <Button bsSize='small' onClick={this.onCancelDelete}>{this.i18n('cancel')}</Button>
            </Modal.Footer>
        </Modal>;
    }
});

module.exports = injectIntl(FactorDetail);
