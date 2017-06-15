'use strict';

import React from "react";
import assign from "object-assign";
import {QuestionAnswerProcessor} from "semforms";
import classNames from "classnames";
import {Button, ControlLabel, Form, FormControl, FormGroup, Glyphicon, InputGroup, Label, Modal} from "react-bootstrap";
import DateTimePicker from "react-bootstrap-datetimepicker";
import {FormattedMessage} from "react-intl";
import JsonLdUtils from "jsonld-utils";
import Constants from "../../constants/Constants";
import DeleteFactorDialog from "./DeleteFactorDialog";
import EventTypeTypeahead from "../typeahead/EventTypeTypeahead";
import ExternalLink from "../misc/ExternalLink";
import FactorStyleInfo from "../../utils/FactorStyleInfo";
import I18nWrapper from "../../i18n/I18nWrapper";
import injectIntl from "../../utils/injectIntl";
import Mask from "../Mask";
import ObjectTypeResolver from "../../utils/ObjectTypeResolver";
import OptionsStore from "../../stores/OptionsStore";
import ReportValidator from "../../validation/ReportValidator";
import Utils from "../../utils/Utils";
import Vocabulary from "../../constants/Vocabulary";
import WizardGenerator from "../wizard/generator/WizardGenerator";
import WizardWindow from "../wizard/WizardWindow";


function convertDurationToCurrentUnit(factor) {
    const targetUnit = gantt.config.duration_unit;
    return Utils.convertTime(factor.durationUnit, targetUnit, factor.duration);
}

class FactorDetail extends React.Component {
    static propTypes = {
        onSave: React.PropTypes.func.isRequired,
        onClose: React.PropTypes.func.isRequired,
        onDelete: React.PropTypes.func.isRequired,
        scale: React.PropTypes.string.isRequired,
        factor: React.PropTypes.object.isRequired,
        report: React.PropTypes.object.isRequired,
        enableDetails: React.PropTypes.bool
    };

    static defaultProps = {
        enableDetails: true
    };

    constructor(props) {
        super(props);
        this.i18n = props.i18n;
        const factor = props.factor;
        this.state = {
            showDeleteDialog: false,
            eventType: JsonLdUtils.jsonLdToTypeaheadOption(ObjectTypeResolver.resolveType(factor.statement.eventType, OptionsStore.getOptions(Constants.OPTIONS.EVENT_TYPE))),
            startDate: factor.start_date.getTime(),
            duration: convertDurationToCurrentUnit(factor),
            statement: factor.statement,
            isWizardOpen: false,
            wizardProperties: null,
            showMask: false
        };
    }

    onDeleteClick = () => {
        this.setState({showDeleteDialog: true});
    };

    onDeleteFactor = () => {
        this.setState({showDeleteDialog: false});
        this.props.onDelete();
    };

    onCancelDelete = () => {
        this.setState({showDeleteDialog: false});
    };

    onDurationMinus = () => {
        this.setState({duration: this.state.duration - 1});
    };

    onDurationPlus = () => {
        this.setState({duration: this.state.duration + 1});
    };

    onDurationSet = (e) => {
        const duration = Number(e.target.value);
        if (isNaN(duration) || duration < 0) {
            return;
        }
        this.setState({duration: duration});
    };

    onEventTypeChange = (option) => {
        this.setState({eventType: option});
    };

    onDateChange = (date) => {
        this.setState({startDate: Number(date)});
    };

    onOpenDetails = () => {
        this.setState({showMask: true});
        const report = this.props.report,
            event = assign({}, this.state.statement);
        this._updateReportForFormGen(report);
        this._mergeStatementState(event);
        WizardGenerator.generateWizard(report, event, this.props.factor.text, this.openDetailsWizard);
    };

    /**
     * If the edited event is an existing one, merges the current state into it, so that the form generator works with
     * latest data.
     *
     * If the event is a new one, adds it to the factor graph with an edge to its parent.
     * @private
     */
    _updateReportForFormGen(report) {
        const nodes = report.factorGraph.nodes;
        let item;
        for (let i = 0, len = nodes.length; i < len; i++) {
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
    }

    openDetailsWizard = (wizardProperties) => {
        wizardProperties.onFinish = this.onUpdateFactorDetails;
        this.setState({
            showMask: false,
            isWizardOpen: true,
            wizardProperties: wizardProperties
        });
    };

    onCloseDetails = () => {
        this.setState({isWizardOpen: false});
    };

    onUpdateFactorDetails = (data, closeCallback) => {
        const statement = assign({}, this.state.statement);

        statement.question = QuestionAnswerProcessor.buildQuestionAnswerModel(data.data, data.stepData);
        this.setState({statement: statement});
        closeCallback();
    };

    onSave = () => {
        const factor = this.props.factor;
        factor.statement = this.state.statement ? this.state.statement : {};
        factor.text = this.state.eventType.name;
        this._mergeStatementState(factor.statement);
        this._removeSuggestedType(factor.statement);
        factor.start_date = new Date(factor.statement.startTime);
        factor.end_date = new Date(factor.statement.endTime);
        this.props.onSave();
    };

    _mergeStatementState(statement) {
        statement.eventType = this.state.eventType.id;
        statement.startTime = this.state.startDate;
        statement.endTime = gantt.calculateEndDate(new Date(statement.startTime), this.state.duration, gantt.config.duration_unit).getTime();
        statement.question = this.state.statement.question;
    };

    _removeSuggestedType(statement) {
        const index = statement.types ? statement.types.indexOf(Vocabulary.SUGGESTED) : -1;
        if (index !== -1) {
            statement.types.splice(index, 1);
        }
    };


    render() {
        const eventTypeLabel = this.props.factor.text,
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
                <DeleteFactorDialog onSubmit={this.onDeleteFactor} onCancel={this.onCancelDelete}
                                    show={this.state.showDeleteDialog}/>
                <Modal.Body ref={comp => this._modalContent = comp}>
                    {this._renderMask()}

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

                <Modal.Footer ref={comp => this._modalFooter = comp}>
                    <Button bsSize='small' bsStyle='success' onClick={this.onSave}
                            disabled={!this.state.eventType}>{this.i18n('save')}</Button>
                    <Button bsSize='small' onClick={this.props.onClose}>{this.i18n('cancel')}</Button>
                    {this.renderDeleteButton()}
                    {this.renderWizardButton()}
                </Modal.Footer>
            </Modal>
        </
            div >;
    }

    _renderMask() {
        return this.state.showMask ? <Mask text={this.i18n('factors.detail.wizard-loading')}/> : null;
    }

    renderFactorTypeIcon() {
        const type = this.state.eventType;
        if (!type) {
            return null;
        }
        let styleInfo = FactorStyleInfo.getStyleInfo(type.type);
        return styleInfo.value ? <div className='col-xs-1'>
                <Label bsStyle={styleInfo.bsStyle} title={styleInfo.title}
                       className='event-type-label'>{styleInfo.value}</Label>
            </div> : null;
    }

    _renderEventTypeLink() {
        const et = this.state.eventType;
        return et ?
            <div className='external-link-container'>
                <ExternalLink url={et.id} title={et.name + '\n' + et.id} className='external-link'/>
            </div> : null;
    }

    _renderStartTimePicker() {
        if (this.props.scale === Constants.TIME_SCALES.RELATIVE) {
            return null;
        }
        return <div className='col-xs-5'>
            <DateTimePicker inputFormat='DD-MM-YY HH:mm' dateTime={this.state.startDate.toString()}
                            label={this.i18n('factors.detail.start')} onChange={this.onDateChange} size='small'
                            inputProps={{
                                title: this.i18n('occurrence.start-time-tooltip'),
                                className: 'inline-input',
                                size: 12
                            }}/>
        </div>;
    }

    renderDuration() {
        const durations = {
            'second': <FormattedMessage id='factors.duration.second' values={{duration: this.state.duration}}/>,
            'minute': <FormattedMessage id='factors.duration.minute' values={{duration: this.state.duration}}/>,
            'hour': <FormattedMessage id='factors.duration.hour' values={{duration: this.state.duration}}/>
        };
        return durations[this.props.scale];
    }

    renderDeleteButton() {
        return this.props.factor.isNew ? null : (
                <Button bsSize='small' bsStyle='warning' onClick={this.onDeleteClick}>{this.i18n('delete')}</Button>);
    }

    renderWizardButton() {
        if (!this.props.enableDetails) {
            return null;
        }
        const disabled = !this.state.eventType || !ReportValidator.isValid(this.props.report);
        return <div style={{float: 'left'}}>
            <Button bsStyle='primary' bsSize='small' onClick={this.onOpenDetails}
                    disabled={disabled}
                    title={this.i18n(disabled ? 'factors.detail.wizard.button-invalid.tooltip' : 'factors.detail.wizard.button.tooltip')}>
                {this.i18n('factors.detail.details')}
            </Button>
        </div>;
    }
}

export default injectIntl(I18nWrapper(FactorDetail));
