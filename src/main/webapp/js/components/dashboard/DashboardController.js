'use strict';

var React = require('react');
var Reflux = require('reflux');

var injectIntl = require('../../utils/injectIntl');

var Actions = require('../../actions/Actions');
var Routing = require('../../utils/Routing');
var Routes = require('../../utils/Routes');
var UserStore = require('../../stores/UserStore');
var RouterStore = require('../../stores/RouterStore');
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

    importE5Report: function (file, onFinish, onError) {
        Actions.importE5Report(file, function (key) {
            onFinish();
            Routing.transitionTo(Routes.editReport, {
                params: {reportKey: key},
                handlers: {onCancel: Routes.dashboard}
            });
        }, onError);
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
                       importE5Report={this.importE5Report}
                       openReport={this.openReport} dashboard={this._resolveDashboard()}/>
        </div>;
    },

    _resolveDashboard: function () {
        var payload = RouterStore.getTransitionPayload(Routes.dashboard.name);
        RouterStore.setTransitionPayload(Routes.dashboard.name, null);
        return payload ? payload.dashboard : null;
    }
});

module.exports = injectIntl(DashboardController);
