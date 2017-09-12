/*
 * Copyright (C) 2017 Czech Technical University in Prague
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

describe('ReportController', function () {

    const React = require('react'),
        Environment = require('../environment/Environment'),
        Generator = require('../environment/Generator').default,
        Actions = require('../../js/actions/Actions'),
        RouterStore = require('../../js/stores/RouterStore'),
        ReportController = require('../../js/components/report/ReportController').default,
        ReportFactory = require('../../js/model/ReportFactory'),
        Routes = require('../../js/utils/Routes'),
        Constants = require('../../js/constants/Constants');

    beforeEach(function () {
        spyOn(Actions, 'loadOptions');
        Environment.mockGantt();
    });

    it('loads existing report when report key is passed in path params', function () {
        spyOn(Actions, 'loadReport');
        const params = {reportKey: 12345},
            controller = Environment.render(<ReportController params={params}/>),
            state = controller.state;
        expect(Actions.loadReport).toHaveBeenCalledWith(params.reportKey);
        expect(state.loading).toBeTruthy();
        expect(state.report).toBeNull();
    });

    it('initializes new report when no key is specified', function () {
        const controller = Environment.render(<ReportController params={{}}/>),
            report = controller.state.report;

        expect(controller.state.loading).toBeFalsy();
        expect(report).toBeDefined();
        expect(report.isNew).toBeTruthy();
        expect(report.occurrence).toBeDefined();
        expect(report.occurrence.startTime).toBeDefined();
        expect(report.occurrence.endTime).toBeDefined();
    });

    it('uses report passed as transition payload', () => {
        const report = ReportFactory.createOccurrenceReport();
        report.initialReport = {
            description: 'Blablabla'
        };
        RouterStore.setTransitionPayload(Routes.createReport.name, report);
        const controller = Environment.render(<ReportController params={{}}/>);

        expect(controller.state.loading).toBeFalsy();
        expect(controller.state.report).toEqual(report);
    });
});
