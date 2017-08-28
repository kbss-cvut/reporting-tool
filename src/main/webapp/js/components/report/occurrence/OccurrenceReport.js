'use strict';

const React = require('react');
const Button = require('react-bootstrap').Button;
const ButtonToolbar = require('react-bootstrap').ButtonToolbar;
const Panel = require('react-bootstrap').Panel;
const assign = require('object-assign');
const device = require('device.js');
const injectIntl = require('../../../utils/injectIntl');

const Actions = require('../../../actions/Actions');
const Attachments = require('../attachment/Attachments').default;
const BasicOccurrenceInfo = require('./BasicOccurrenceInfo').default;
const Factors = require('../../factor/Factors');
const CorrectiveMeasures = require('../../correctivemeasure/CorrectiveMeasures').default;
const InitialReport = require('../initial/InitialReport').default;
const PhaseTransition = require('../../misc/PhaseTransition').default;
const ReportProvenance = require('../ReportProvenance').default;
const ReportSummary = require('../ReportSummary').default;
const MessageMixin = require('../../mixin/MessageMixin');
const ReportValidator = require('../../../validation/ReportValidator');
const I18nMixin = require('../../../i18n/I18nMixin');
const ReportDetailMixin = require('../../mixin/ReportDetailMixin');
const SmallScreenFactors = require('../../factor/smallscreen/SmallScreenFactors').default;
const WizardGenerator = require('../../wizard/generator/WizardGenerator');
const WizardWindow = require('../../wizard/WizardWindow');

const BASE_URL_WITH_SLASH = 'rest/reports/';

const OccurrenceReport = React.createClass({
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
            showDeleteDialog: false,
            showInitialReport: false
        };
    },

    componentWillUnmount: function () {
        this.cleanupMessages();
    },

    onChanges: function (changes) {
        this.props.handlers.onChange(changes);
    },

    onSave: function () {
        const report = this.props.report;
        this.onLoading();
        report.factorGraph = this.factors.getFactorGraph();
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

    onExportToE5X: function () {
        let localFileAddress = BASE_URL_WITH_SLASH + this.props.report.key + "/export/e5x";
        window.open(localFileAddress);
    },

    _reportSummary: function () {
        this.setState({loadingWizard: true});
        let report = assign({}, this.props.report);
        report.factorGraph = this.factors.getFactorGraph();
        WizardGenerator.generateSummaryWizard(report, this.i18n('report.summary'), this.openSummaryWizard);
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

    _displayInitialReport: function () {
        this.setState({showInitialReport: true});
    },

    _hideInitialReport: function () {
        this.setState({showInitialReport: false});
    },

    render: function () {
        const report = this.props.report;

        return <div>
            <WizardWindow {...this.state.wizardProperties} show={this.state.isWizardOpen}
                          onHide={this.closeSummaryWizard} enableForwardSkip={true}/>
            {this.state.showInitialReport &&
            <InitialReport initialReport={report.initialReport} onClose={this._hideInitialReport}/>}

            <Panel header={this.renderHeader()} bsStyle='primary'>
                <ButtonToolbar className='float-right'>
                    {this._renderSummaryButton()}
                </ButtonToolbar>
                <form>
                    <BasicOccurrenceInfo report={report} revisions={this.props.revisions}
                                         onChange={this.props.handlers.onChange}/>

                    <div>
                        {this._renderFactors()}
                    </div>

                    <div className='form-group'>
                        <CorrectiveMeasures report={report} onChange={this.props.handlers.onChange}/>
                    </div>

                    <div className='row'>
                        <div className='col-xs-12'>
                            <ReportSummary report={report} onChange={this.props.handlers.onChange}/>
                        </div>
                    </div>

                    <div className='form-group'>
                        <Attachments report={report} onChange={this.props.handlers.onChange}/>
                    </div>

                    <Panel>
                        <ReportProvenance report={report}>
                            <div className='row'>
                                <div className='col-xs-4'>
                                    {this.props.revisions}
                                </div>
                            </div>
                            {this._renderInitialReportTrigger()}
                        </ReportProvenance>
                    </Panel>

                    {this.renderButtons()}
                </form>
            </Panel>
            {this.renderMessage()}
            {this.renderDeleteDialog()}
        </div>;
    },

    renderHeader: function () {
        let fileNo = null;
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

    _renderSummaryButton: function () {
        const report = this.props.report,
            valid = ReportValidator.isValid(report);
        return report.isNew ? null :
            <Button bsStyle='primary' bsSize='small' className='detail-top-button' onClick={this._reportSummary}
                    title={this.i18n(valid ? 'report.summary.button.title' : 'report.summary.button.title-invalid')}
                    disabled={this.state.loadingWizard || !valid}>
                {this.i18n(this.state.loadingWizard ? 'please-wait' : 'summary')}
            </Button>;
    },

    _renderFactors: function () {
        const dev = device();
        return dev.tablet() || dev.mobile() ?
            <SmallScreenFactors ref={(c) => this.factors = c ? c.getWrappedInstance().getWrappedComponent() : c}
                                report={this.props.report} rootAttribute='occurrence' onChange={this.onChanges}/> :
            <Factors ref={(c) => this.factors = c ? c.getWrappedInstance() : c} report={this.props.report}
                     rootAttribute='occurrence'
                     onChange={this.onChanges}/>;
    },

    _renderInitialReportTrigger: function () {
        if (!this.props.report.initialReport) {
            return null;
        }
        return <div className='row'>
            <div className='col-xs-2 form-group'>
                <Button bsStyle='primary' bsSize='small' onClick={this._displayInitialReport}
                        title={this.i18n('report.initial.view.tooltip')}>
                    {this.i18n('report.initial.label')}
                </Button>
            </div>
        </div>;
    },

    renderButtons: function () {
        if (this.props.readOnly) {
            return this.renderReadOnlyButtons();
        }
        let loading = this.state.submitting !== false,
            saveDisabled = !ReportValidator.isValid(this.props.report) || loading;

        return <ButtonToolbar className='float-right detail-button-toolbar'>
            <Button bsStyle='success' bsSize='small' disabled={saveDisabled} title={this.getSaveButtonTitle()}
                    onClick={this.onSave}>{this._getSaveButtonLabel()}</Button>
            <Button bsStyle='link' bsSize='small' title={this.i18n('cancel-tooltip')} disabled={loading}
                    onClick={this.props.handlers.onCancel}>{this.i18n('cancel')}</Button>
            {this.renderSubmitButton()}
            <PhaseTransition report={this.props.report} onLoading={this.onLoading} disabled={saveDisabled}
                             onSuccess={this.onPhaseTransitionSuccess} onError={this.onPhaseTransitionError}/>
            {this.renderExportToE5XButton()}
            {this.renderDeleteButton()}
        </ButtonToolbar>;
    },

    _getSaveButtonLabel: function () {
        return this.i18n(this.state.submitting ? 'detail.saving' : 'save');
    },

    getSaveButtonTitle: function () {
        let titleProp = 'detail.save-tooltip';
        if (this.state.submitting) {
            titleProp = 'detail.saving';
        } else if (!ReportValidator.isValid(this.props.report)) {
            titleProp = ReportValidator.getValidationMessage(this.props.report);
        }
        return this.i18n(titleProp);
    },

    renderSubmitButton: function () {
        return this.props.report.isNew ? null :
            <Button bsStyle='primary' bsSize='small' title={this.i18n('detail.submit-tooltip')} onClick={this.onSubmit}
                    disabled={this.state.submitting !== false}>
                {this.i18n('detail.submit')}
            </Button>;
    },

    renderExportToE5XButton: function () {
        return this.props.report.isNew ? null :
            <Button bsStyle='primary' bsSize='small' title={this.i18n('exportToE5X')} onClick={this.onExportToE5X}
                    disabled={this.state.submitting !== false}>
                {this.i18n('exportToE5X')}
            </Button>;
    }
});

module.exports = injectIntl(OccurrenceReport);
