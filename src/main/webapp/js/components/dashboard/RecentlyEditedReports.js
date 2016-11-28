'use strict';

var React = require('react');
var Label = require('react-bootstrap').Label;
var Panel = require('react-bootstrap').Panel;
var Table = require('react-bootstrap').Table;
var Reflux = require('reflux');

var injectIntl = require('../../utils/injectIntl');

var Actions = require('../../actions/Actions');
var Utils = require('../../utils/Utils');
var CollapsibleText = require('../CollapsibleText');
var Mask = require('../Mask').default;
var ReportType = require('../../model/ReportType');
var ReportStore = require('../../stores/ReportStore');
var I18nMixin = require('../../i18n/I18nMixin');

var RECENTLY_EDITED_COUNT = 10;

var RecentlyEditedReports = React.createClass({
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
        var reports = this.state.reports.slice();
        reports.sort(function (a, b) {
            var aEdited = a.lastModified ? a.lastModified : a.dateCreated,
                bEdited = b.lastModified ? b.lastModified : b.dateCreated;
            return bEdited - aEdited;
        });
        return reports.slice(0, RECENTLY_EDITED_COUNT);
    },

    render: function () {
        var title = (<h5>{this.i18n('dashboard.recent-panel-heading')}</h5>);
        return (
            <Panel header={title} bsStyle='info' style={{height: '100%'}}>
                {this._renderPanelContent()}
            </Panel>
        );
    },

    _renderPanelContent: function () {
        if (!this.state.reports) {
            return <Mask text={this.i18n('reports.loading-mask')} classes='mask-container'/>;
        }
        var recentReports = this.renderRecentReports(this.filterRecentReports());
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
        var toRender = [];
        for (var i = 0, len = reports.length; i < len; i++) {
            toRender.push(<ReportRow key={reports[i].key} report={reports[i]} onOpenReport={this.props.onOpenReport}/>);
        }
        return toRender;
    }
});

var ReportRow = injectIntl(React.createClass({
    mixins: [I18nMixin],

    onOpenClick: function (e) {
        e.preventDefault();
        this.props.onOpenReport(this.props.report);
    },

    render: function () {
        const report = ReportType.getReport(this.props.report),
            vAlign = {verticalAlign: 'middle'},
            dateEdited = report.lastModified ? report.lastModified : report.dateCreated;
        return <tr>
            <td style={vAlign}>
                <a href='javascript:void(0);' onClick={this.onOpenClick}
                   title={this.i18n('reports.open-tooltip')}><CollapsibleText
                    text={report.identification}
                    maxLength={20}/></a>
            </td>
            <td style={vAlign}
                className='content-center'>{report.date ? Utils.formatDate(new Date(report.date)) : ''}</td>
            <td style={vAlign} className='content-center'>{Utils.formatDate(new Date(dateEdited))}</td>
            <td style={vAlign} className='content-center'>
                <Label title={this.i18n(report.toString())}>{this.i18n(report.getPrimaryLabel())}</Label>
            </td>
        </tr>;
    }
}));

module.exports = injectIntl(RecentlyEditedReports);
