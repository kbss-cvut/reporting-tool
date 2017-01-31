/*
 * Copyright (C) 2016 Czech Technical University in Prague
 *
 * This program is free software: you can redistribute it and/or modify it under
 * the terms of the GNU General Public License as published by the Free Software
 * Foundation, either version 3 of the License, or (at your option) any
 * later version.
 *
 * This program is distributed in the hope that it will be useful, but WITHOUT
 * ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
 * FOR A PARTICULAR PURPOSE.  See the GNU General Public License for more
 * details. You should have received a copy of the GNU General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
 */
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

    _reportSummary: function () {
        this.setState({loadingWizard: true});
        const report = assign({}, this.props.report);
        report.factorGraph = this.factors.getFactorGraph();
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
        const report = this.props.report;

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
                        {this._renderFactors()}
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

    _renderFactors: function () {
        const dev = device();
        return dev.tablet() || dev.mobile() ?
            <SmallScreenFactors ref={(c) => this.factors = c ? c.getWrappedInstance().getWrappedComponent() : c}
                                report={this.props.report} rootAttribute='occurrence' onChange={this.onChanges}/> :
            <Factors ref={(c) => this.factors = c ? c.getWrappedInstance() : c} report={this.props.report}
                     rootAttribute='occurrence'
                     onChange={this.onChanges}/>;
    },

    renderButtons: function () {
        if (this.props.readOnly) {
            return this.renderReadOnlyButtons();
        }
        const loading = this.state.submitting,
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
            <Button bsStyle='primary' bsSize='small' title={this.i18n('detail.submit-tooltip')} onClick={this.onSubmit}>
                {this.i18n('detail.submit')}
            </Button>;
    }
});

module.exports = injectIntl(OccurrenceReport);
