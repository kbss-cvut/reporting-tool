'use strict';

var React = require('react');
var Button = require('react-bootstrap').Button;
var ButtonToolbar = require('react-bootstrap').ButtonToolbar;
var Panel = require('react-bootstrap').Panel;
var assign = require('object-assign');
var injectIntl = require('../../../utils/injectIntl');

var Actions = require('../../../actions/Actions');
var Attachments = require('../attachment/Attachments').default;
var BasicOccurrenceInfo = require('./BasicOccurrenceInfo').default;
var Factors = require('../../factor/Factors');
var CorrectiveMeasures = require('../../correctivemeasure/CorrectiveMeasures').default;
var PhaseTransition = require('../../misc/PhaseTransition').default;
var ReportProvenance = require('../ReportProvenance').default;
var ReportSummary = require('../ReportSummary').default;
var MessageMixin = require('../../mixin/MessageMixin');
var ReportValidator = require('../../../validation/ReportValidator');
var I18nMixin = require('../../../i18n/I18nMixin');
var ReportDetailMixin = require('../../mixin/ReportDetailMixin');
var WizardGenerator = require('../../wizard/generator/WizardGenerator');
var WizardWindow = require('../../wizard/WizardWindow');

var OccurrenceReport = React.createClass({
    mixins: [MessageMixin, I18nMixin, ReportDetailMixin],

    propTypes: {
        handlers: React.PropTypes.object,
        report: React.PropTypes.object,
        loading: React.PropTypes.bool
    },

    getInitialState: function () {
        return {
            submitting: false,
            loadingWizard: false,
            isWizardOpen: false,
            wizardProperties: null,
            showDeleteDialog: false
        };
    },

    componentWillUnmount: function () {
        this.cleanupMessages();
    },

    onChanges: function (changes) {
        this.props.handlers.onChange(changes);
    },

    onSave: function () {
        var report = this.props.report,
            factors = this.refs.factors.getWrappedInstance();
        this.onLoading();
        report.factorGraph = factors.getFactorGraph();
        if (report.isNew) {
            Actions.createReport(report, this.onSaveSuccess, this.onSaveError);
        } else {
            Actions.updateReport(report, this.onSaveSuccess, this.onSaveError);
        }
    },

    onSubmit: function () {
        this.onLoading();
        Actions.submitReport(this.props.report, this.onSubmitSuccess, this.onSubmitError);
    },

    _reportSummary: function () {
        this.setState({loadingWizard: true});
        var report = assign({}, this.props.report);
        report.factorGraph = this.refs.factors.getWrappedInstance().getFactorGraph();
        WizardGenerator.generateWizard(report, {}, this.i18n('report.summary'), this.openSummaryWizard);
    },

    openSummaryWizard: function (wizardProperties) {
        wizardProperties.onFinish = this.closeSummaryWizard;
        this.setState({
            loadingWizard: false,
            isWizardOpen: true,
            wizardProperties: wizardProperties
        });
    },

    closeSummaryWizard: function () {
        this.setState({isWizardOpen: false});
    },

    render: function () {
        var report = this.props.report;

        return <div>
            <WizardWindow {...this.state.wizardProperties} show={this.state.isWizardOpen}
                          onHide={this.closeSummaryWizard} enableForwardSkip={true}/>

            <Panel header={this.renderHeader()} bsStyle='primary'>
                <ButtonToolbar className='float-right'>
                    <Button bsStyle='primary' onClick={this._reportSummary} disabled={this.state.loadingWizard}>
                        {this.i18n(this.state.loadingWizard ? 'please-wait' : 'summary')}
                    </Button>
                </ButtonToolbar>
                <form>
                    <BasicOccurrenceInfo report={report} revisions={this.props.revisions}
                                         onChange={this.props.handlers.onChange}/>

                    <div>
                        <Factors ref='factors' report={report} rootAttribute='occurrence' onChange={this.onChanges}/>
                    </div>

                    <div className='form-group'>
                        <CorrectiveMeasures report={report} onChange={this.props.handlers.onChange}/>
                    </div>

                    <div className='row'>
                        <div className='col-xs-12'>
                            <ReportSummary report={report} onChange={this.onChange}/>
                        </div>
                    </div>

                    <div className='form-group'>
                        <Attachments report={report} onChange={this.props.handlers.onChange}/>
                    </div>

                    <Panel>
                        <ReportProvenance report={report} revisions={this.props.revisions}/>
                    </Panel>

                    {this.renderButtons()}
                </form>
            </Panel>
            {this.renderMessage()}
            {this.renderDeleteDialog()}
        </div>;
    },

    renderHeader: function () {
        var fileNo = null;
        if (this.props.report.fileNumber) {
            fileNo =
                <h3 className='panel-title pull-right'>{this.i18n('fileNo') + ' ' + this.props.report.fileNumber}</h3>;
        }
        return <div>
            <h2 className='panel-title pull-left'>{this.i18n('occurrencereport.title')}</h2>
            {fileNo}
            <div style={{clear: 'both'}}/>
        </div>;
    },

    renderButtons: function () {
        if (this.props.readOnly) {
            return this.renderReadOnlyButtons();
        }
        var loading = this.state.submitting,
            saveDisabled = !ReportValidator.isValid(this.props.report) || loading,
            saveLabel = this.i18n(loading ? 'detail.saving' : 'save');

        return <ButtonToolbar className='float-right detail-button-toolbar'>
            <Button bsStyle='success' bsSize='small' disabled={saveDisabled} title={this.getSaveButtonTitle()}
                    onClick={this.onSave}>{saveLabel}</Button>
            <Button bsStyle='link' bsSize='small' title={this.i18n('cancel-tooltip')}
                    onClick={this.props.handlers.onCancel}>{this.i18n('cancel')}</Button>
            {this.renderSubmitButton()}
            <PhaseTransition report={this.props.report} onLoading={this.onLoading}
                             onSuccess={this.onPhaseTransitionSuccess} onError={this.onPhaseTransitionError}/>
            {this.renderDeleteButton()}
        </ButtonToolbar>;
    },

    getSaveButtonTitle: function () {
        var titleProp = 'detail.save-tooltip';
        if (this.state.submitting) {
            titleProp = 'detail.saving';
        } else if (!ReportValidator.isValid(this.props.report)) {
            titleProp = ReportValidator.getValidationMessage(this.props.report);
        }
        return this.i18n(titleProp);
    },

    renderSubmitButton: function () {
        return this.props.report.isNew ? null :
            <Button bsStyle='primary' bsSize='small' title={this.i18n('detail.submit-tooltip')} onClick={this.onSubmit}>
                {this.i18n('detail.submit')}
            </Button>;
    }
});

module.exports = injectIntl(OccurrenceReport);
