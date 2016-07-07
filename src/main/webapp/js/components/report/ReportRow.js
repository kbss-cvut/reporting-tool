'use strict';

var React = require('react');
var Button = require('react-bootstrap').Button;
var Label = require('react-bootstrap').Label;
var Reflux = require('reflux');
var classNames = require('classnames');

var injectIntl = require('../../utils/injectIntl');

var Utils = require('../../utils/Utils.js');
var OptionsStore = require('../../stores/OptionsStore');
var ReportType = require('../../model/ReportType');
var Routes = require('../../utils/Routes');
var DeleteReportDialog = require('./DeleteReportDialog');
var I18nMixin = require('../../i18n/I18nMixin');

var ReportRow = React.createClass({
    mixins: [I18nMixin, Reflux.listenTo(OptionsStore, '_onPhasesLoaded')],

    getInitialState: function () {
        return {
            modalOpen: false
        };
    },

    _onPhasesLoaded(type) {
        if (type === 'reportingPhase') {
            this.forceUpdate();
        }
    },

    onDoubleClick: function (e) {
        e.preventDefault();
        this.onEditClick();
    },

    onEditClick: function () {
        this.props.actions.onEdit(this.props.report);
    },

    onDeleteClick: function () {
        this.setState({modalOpen: true});
    },

    onCloseModal: function () {
        this.setState({modalOpen: false});
    },

    removeReport: function () {
        this.props.actions.onRemove(this.props.report);
        this.onCloseModal();
    },


    render: function () {
        var report = ReportType.getReport(this.props.report),
            formattedDate = '',
            stateClasses = ['report-row', 'content-center'], stateTooltip = null;
        if (report.date) {
            formattedDate = Utils.formatDate(new Date(report.date));
        }
        return <tr onDoubleClick={this.onDoubleClick}>
            <td className='report-row'><a href={'#/' + Routes.reports.path + '/' + report.key}
                                          title={this.i18n('reports.open-tooltip')}>{report.identification}</a>
            </td>
            <td className='report-row content-center'>{formattedDate}</td>
            <td className='report-row'>{report.renderMoreInfo()}</td>
            <td className='report-row content-center'>
                <Label title={this.i18n(report.toString())}>{this.i18n(report.getLabel())}</Label>
            </td>
            <td className={classNames(stateClasses)} title={stateTooltip}>
                {report.getPhase(OptionsStore.getOptions('reportingPhase'), this.props.intl)}
            </td>
            <td className='report-row actions'>
                <Button bsStyle='primary' bsSize='small' title={this.i18n('reports.open-tooltip')}
                        onClick={this.onEditClick}>{this.i18n('open')}</Button>
                <Button bsStyle='warning' bsSize='small' title={this.i18n('reports.delete-tooltip')}
                        onClick={this.onDeleteClick}>{this.i18n('delete')}</Button>

                <DeleteReportDialog show={this.state.modalOpen} onClose={this.onCloseModal}
                                    onSubmit={this.removeReport}/>
            </td>
        </tr>;
    }
});

module.exports = injectIntl(ReportRow);
