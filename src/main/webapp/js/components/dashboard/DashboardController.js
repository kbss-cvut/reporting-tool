'use strict';

var React = require('react');
var Reflux = require('reflux');

var injectIntl = require('../../utils/injectIntl');

var Actions = require('../../actions/Actions');
var Routing = require('../../utils/Routing');
var Routes = require('../../utils/Routes');
var UserStore = require('../../stores/UserStore');
var Dashboard = require('./Dashboard');
var I18nMixin = require('../../i18n/I18nMixin');

var DashboardController = React.createClass({
    mixins: [
        Reflux.listenTo(UserStore, 'onUserLoaded'),
        I18nMixin
    ],
    getInitialState: function () {
        return {
            firstName: UserStore.getCurrentUser() ? UserStore.getCurrentUser().firstName : ''
        }
    },

    componentWillMount: function () {
        Actions.loadAllReports();
    },

    onUserLoaded: function (user) {
        this.setState({firstName: user.firstName});
    },

    createEmptyReport: function () {
        Routing.transitionTo(Routes.createReport, {
            handlers: {
                onSuccess: Routes.reports,
                onCancel: Routes.dashboard
            }
        });
    },

    openReport: function (report) {
        Routing.transitionTo(Routes.editReport, {
            params: {reportKey: report.key},
            handlers: {onCancel: Routes.dashboard}
        });
    },

    showReports: function () {
        Routing.transitionTo(Routes.reports);
    },


    render: function () {
        return <div>
            <Dashboard userFirstName={this.state.firstName}
                       showAllReports={this.showReports} createEmptyReport={this.createEmptyReport}
                       openReport={this.openReport}/>
        </div>;
    }
});

module.exports = injectIntl(DashboardController);
