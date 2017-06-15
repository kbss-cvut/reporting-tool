'use strict';

describe('Routing rules', () => {

    var RoutingRules = require('../../js/utils/RoutingRules'),
        Actions = require('../../js/actions/Actions'),
        Routes = require('../../js/utils/Routes');

    it('resets component state store when dashboard route is used', () => {
        spyOn(Actions, 'resetComponentState');
        RoutingRules.execute(Routes.dashboard.name);
        expect(Actions.resetComponentState).toHaveBeenCalledWith(require('../../js/components/report/ReportsController').displayName);
        expect(Actions.resetComponentState).toHaveBeenCalledWith(require('../../js/components/report/ReportsTable').WrappedComponent.displayName);
    });

    it('resets component state store when statistics route is used', () => {
        spyOn(Actions, 'resetComponentState');
        RoutingRules.execute(Routes.statistics.name);
        expect(Actions.resetComponentState).toHaveBeenCalledWith(require('../../js/components/report/ReportsController').displayName);
        expect(Actions.resetComponentState).toHaveBeenCalledWith(require('../../js/components/report/ReportsTable').WrappedComponent.displayName);
    });
});
