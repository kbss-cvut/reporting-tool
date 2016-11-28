'use strict';

var React = require('react');
var Panel = require('react-bootstrap').Panel;
var Table = require('react-bootstrap').Table;
var Button = require('react-bootstrap').Button;
var Glyphicon = require('react-bootstrap').Glyphicon;
var assign = require('object-assign');

var injectIntl = require('../../utils/injectIntl');

var InitialReportSteps = require('./Steps');
var CollapsibleText = require('../CollapsibleText');
var WizardWindow = require('../wizard/WizardWindow');
var I18nMixin = require('../../i18n/I18nMixin');
var WizardStore = require('../../stores/WizardStore');

var InitialReports = React.createClass({
    mixins: [I18nMixin],

    propTypes: {
        report: React.PropTypes.object.isRequired,
        onAttributeChange: React.PropTypes.func.isRequired
    },

    getInitialState: function () {
        return {
            showInitialReportWizard: false,
            editedInitialReportIndex: null,
            wizardProperties: null
        }
    },

    addInitialReport: function () {
        WizardStore.initWizard({initialReport: {}});
        this.setState({
            showInitialReportWizard: true,
            wizardProperties: {
                steps: InitialReportSteps,
                title: this.i18n('initial.wizard.add-title'),
                onFinish: this.saveNewInitialReport
            }
        });
    },

    editInitialReport: function (e) {
        var targetId = e.target.id, index;

        index = Number(targetId.substring(targetId.indexOf('_') + 1));
        WizardStore.initWizard({initialReport: assign({}, this.props.report.initialReports[index])});
        this.setState({
            showInitialReportWizard: true,
            editedInitialReportIndex: index,
            wizardProperties: {
                steps: InitialReportSteps,
                title: this.i18n('initial.wizard.edit-title'),
                onFinish: this.saveInitialReport
            }
        });
    },

    closeInitialReport: function () {
        this.setState({showInitialReportWizard: false, editedInitialReportIndex: null});
    },

    saveNewInitialReport: function (wizardData, closeCallback) {
        var initialReports = this.props.report.initialReports;
        initialReports.push(wizardData.data.initialReport);
        this.props.onAttributeChange('initialReports', initialReports);
        closeCallback();
    },

    saveInitialReport: function (wizardData, closeCallback) {
        var initialReports = this.props.report.initialReports;
        initialReports[this.state.editedInitialReportIndex] = wizardData.data.initialReport;
        this.props.onAttributeChange('initialReports', initialReports);
        closeCallback();
    },


    render: function () {
        if (!this.props.report.initialReports) {
            this.props.report.initialReports = [];
        }
        var content = this.renderContent();
        var buttonCls = this.props.report.initialReports.length !== 0 ? 'float-right' : '';
        return (
            <div>
                <WizardWindow ref='initialReportWizard' {...this.state.wizardProperties}
                              show={this.state.showInitialReportWizard}
                              onHide={this.closeInitialReport}/>
                <Panel header={this.renderHeader()} bsStyle='info'>
                    {content}
                    <div className={buttonCls}>
                        <Button ref='addInitialReport' bsStyle='primary' bsSize='small'
                                onClick={this.addInitialReport}>
                            <Glyphicon glyph='plus' style={{margin: '0 5px 0 0'}}/>
                            {this.i18n('add')}
                        </Button>
                    </div>
                </Panel>
            </div>
        );
    },

    renderHeader: function () {
        return (
            <h5>{this.i18n('initial.panel-title')}</h5>
        );
    },

    renderContent: function () {
        if (this.props.report.initialReports.length == 0) {
            return null;
        } else {
            return (
                <Table striped bordered condensed hover>
                    <thead>
                    <tr>
                        <th>{this.i18n('initial.table-report')}</th>
                        <th>{this.i18n('table-actions')}</th>
                    </tr>
                    </thead>
                    <tbody>
                    {this.renderInitialReports()}
                    </tbody>
                </Table>
            );
        }
    },

    renderInitialReports: function () {
        var initialReports = this.props.report.initialReports;
        var rows = [];
        if (!initialReports) {
            return rows;
        }
        for (var i = 0, len = initialReports.length; i < len; i++) {
            var rep = initialReports[i];
            rows.push(
                <tr key={'initialReport' + i}>
                    <td className='col-xs-11'>
                        <CollapsibleText text={rep.text} maxLength={150}/>
                    </td>
                    <td className='col-xs-1' style={{verticalAlign: 'middle', textAlign: 'center'}}>
                        <Button id={'editInitial_' + i} bsStyle='primary' bsSize='small'
                                onClick={this.editInitialReport}>{this.i18n('table-edit')}</Button>
                    </td>
                </tr>);
        }
        return rows;
    }
});

module.exports = injectIntl(InitialReports);
