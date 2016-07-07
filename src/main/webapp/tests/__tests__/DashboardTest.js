'use strict';

describe('Dashboard', () => {

    var React = require('react'),
        Environment = require('../environment/Environment'),
        Constants = require('../../js/constants/Constants'),
        Dashboard = require('../../js/components/dashboard/Dashboard'),

        createEmptyReport,
        importE5Report,
        showAllReports,
        openReport;

    beforeEach(() => {
        createEmptyReport = jasmine.createSpy('createEmptyReport');
        importE5Report = jasmine.createSpy('importE5Report');
        showAllReports = jasmine.createSpy('showAllReports');
        openReport = jasmine.createSpy('openReport');
    });

    it('goes from create report dashboard to main dashboard when goBack is triggered', () => {
        var component = Environment.render(<Dashboard createEmptyReport={createEmptyReport}
                                                      importE5Report={importE5Report} showAllReports={showAllReports}
                                                      openReport={openReport}
                                                      dashboard={Constants.DASHBOARDS.CREATE_REPORT.id}/>);
        expect(component.state.dashboard).toEqual(Constants.DASHBOARDS.CREATE_REPORT.id);
        component.goBack();
        expect(component.state.dashboard).toEqual(Constants.DASHBOARDS.MAIN.id);
    });

    it('goes to create report dashboard from import report dashboard when goBack is triggered', () => {
        var component = Environment.render(<Dashboard createEmptyReport={createEmptyReport}
                                                      importE5Report={importE5Report} showAllReports={showAllReports}
                                                      openReport={openReport}
                                                      dashboard={Constants.DASHBOARDS.IMPORT_REPORT.id}/>);
        expect(component.state.dashboard).toEqual(Constants.DASHBOARDS.IMPORT_REPORT.id);
        component.goBack();
        expect(component.state.dashboard).toEqual(Constants.DASHBOARDS.CREATE_REPORT.id);
    });
});
