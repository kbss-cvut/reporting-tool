'use strict';

var React = require('react');
var Jumbotron = require('react-bootstrap').Jumbotron;
var Grid = require('react-bootstrap').Grid;
var Col = require('react-bootstrap').Col;
var Row = require('react-bootstrap').Row;

var injectIntl = require('../../utils/injectIntl');
var FormattedMessage = require('react-intl').FormattedMessage;

var Tile = require('./DashboardTile').default;
var RecentlyEdited = require('./RecentlyEditedReports');
var I18nMixin = require('../../i18n/I18nMixin');

var Dashboard = React.createClass({
    mixins: [I18nMixin],

    propTypes: {
        createEmptyReport: React.PropTypes.func.isRequired,
        showAllReports: React.PropTypes.func.isRequired,
        openReport: React.PropTypes.func.isRequired,
        userFirstName: React.PropTypes.string
    },


    render: function () {
        return <div className='row'>
            <div className='col-xs-8'>
                <Jumbotron>
                    {this.renderTitle()}
                    {this.renderDashboardContent()}
                </Jumbotron>
            </div>
            <div className='col-xs-4'>
                <div>
                    <RecentlyEdited reports={this.props.reports} onOpenReport={this.props.openReport}/>
                </div>
            </div>
        </div>;
    },

    renderTitle: function () {
        return <h3><FormattedMessage id='dashboard.welcome'
                                     values={{name: <span className='bold'>{this.props.userFirstName}</span>}}/>
        </h3>;
    },

    renderDashboardContent: function () {
        return this._renderMainDashboard();
    },

    _renderMainDashboard: function () {
        return <Grid fluid={true}>
            <Row>
                <Col xs={6} className='dashboard-sector'>
                    <Tile onClick={this.props.createEmptyReport}>{this.i18n('dashboard.create-tile')}</Tile>
                </Col>
                <Col xs={6} className='dashboard-sector'>
                    <Tile
                        onClick={this.props.showAllReports}>{this.i18n('dashboard.view-all-tile')}</Tile>
                </Col>
            </Row>
        </Grid>;
    }
});

module.exports = injectIntl(Dashboard);
