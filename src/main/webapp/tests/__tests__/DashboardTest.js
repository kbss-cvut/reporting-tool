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
