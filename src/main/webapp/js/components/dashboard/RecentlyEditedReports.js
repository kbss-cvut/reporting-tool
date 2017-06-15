'use strict';

const React = require('react');
const Label = require('react-bootstrap').Label;
const Panel = require('react-bootstrap').Panel;
const Table = require('react-bootstrap').Table;
const Reflux = require('reflux');

const injectIntl = require('../../utils/injectIntl');

const Actions = require('../../actions/Actions');
const Utils = require('../../utils/Utils');
const CollapsibleText = require('../CollapsibleText');
const Mask = require('../Mask').default;
const ReportType = require('../../model/ReportType');
const ReportStore = require('../../stores/ReportStore');
const I18nMixin = require('../../i18n/I18nMixin');

const RECENTLY_EDITED_COUNT = 10;

const RecentlyEditedReports = React.createClass({
    mixins: [I18nMixin,
        Reflux.listenTo(ReportStore, '_onReportsLoaded')],

    getInitialState: function () {
        return {
            reports: ReportStore.getReports()
        }
    },

    _onReportsLoaded: function (data) {
        if (data.action === Actions.loadAllReports) {
            this.setState({reports: data.reports});
        }
    },

    filterRecentReports: function () {
        const reports = this.state.reports.slice();
        reports.sort(function (a, b) {
            const aEdited = a.lastModified ? a.lastModified : a.dateCreated,
                bEdited = b.lastModified ? b.lastModified : b.dateCreated;
            return bEdited - aEdited;
        });
        return reports.slice(0, RECENTLY_EDITED_COUNT);
    },

    render: function () {
        const title = (<h5>{this.i18n('dashboard.recent-panel-heading')}</h5>);
        return <Panel header={title} bsStyle='info' style={{height: '100%'}}>
            {this._renderPanelContent()}
        </Panel>;
    },

    _renderPanelContent: function () {
        if (!this.state.reports) {
            return <Mask text={this.i18n('reports.loading-mask')} classes='mask-container'/>;
        }
        const recentReports = this.renderRecentReports(this.filterRecentReports());
        if (recentReports.length > 0) {
            return <Table striped bordered condensed hover>
                <thead>
                <tr>
                    <th className='col-xs-5'>{this.i18n('headline')}</th>
                    <th className='col-xs-3 content-center' title={this.i18n('reports.table-date.tooltip')}>
                        {this.i18n('reports.table-date')}
                    </th>
                    <th className='col-xs-3 content-center'>{this.i18n('dashboard.recent-table-last-edited')}</th>
                    <th className='col-xs-1 content-center'>{this.i18n('reports.table-type')}</th>
                </tr>
                </thead>
                <tbody>
                {recentReports}
                </tbody>
            </Table>;
        } else {
            return <div>{this.i18n('dashboard.recent.no-reports')}</div>;
        }
    },

    renderRecentReports: function (reports) {
        const toRender = [];
        for (let i = 0, len = reports.length; i < len; i++) {
            toRender.push(<ReportRow key={reports[i].key} report={reports[i]} onOpenReport={this.props.onOpenReport}/>);
        }
        return toRender;
    }
});

const ReportRow = injectIntl(React.createClass({
    mixins: [I18nMixin],

    onOpenClick: function (e) {
        e.preventDefault();
        this.props.onOpenReport(this.props.report);
    },

    render: function () {
        const report = ReportType.getReport(this.props.report),
            dateEdited = report.lastModified ? report.lastModified : report.dateCreated;
        return <tr>
            <td className='report-row'>
                <a href='javascript:void(0);' onClick={this.onOpenClick}
                   title={this.i18n('reports.open-tooltip')}><CollapsibleText
                    text={report.identification}
                    maxLength={20}/></a>
            </td>
            <td className='report-row content-center'>{Utils.formatDate(report.date)}</td>
            <td className='report-row content-center'>{Utils.formatDate(new Date(dateEdited))}</td>
            <td className='report-row content-center'>
                <Label title={this.i18n(report.toString())}>{this.i18n(report.getPrimaryLabel())}</Label>
            </td>
        </tr>;
    }
}));

ReportRow.propTypes = {
    report: React.PropTypes.object.isRequired,
    onOpenReport: React.PropTypes.func.isRequired
};

module.exports = injectIntl(RecentlyEditedReports);
