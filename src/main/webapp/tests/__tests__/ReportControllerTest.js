'use strict';

describe('ReportController', function () {

    var React = require('react'),
        Environment = require('../environment/Environment'),
        Generator = require('../environment/Generator').default,
        Actions = require('../../js/actions/Actions'),
        RouterStore = require('../../js/stores/RouterStore'),
        ReportController = require('../../js/components/report/ReportController'),
        Routes = require('../../js/utils/Routes'),
        Constants = require('../../js/constants/Constants');

    beforeEach(function () {
        spyOn(Actions, 'loadOptions');
        spyOn(Actions, 'loadOccurrenceCategories');
        spyOn(Actions, 'loadEventTypes');
        Environment.mockGantt();
    });

    it('Loads existing report when report key is passed in path params', function () {
        spyOn(Actions, 'loadReport');
        var params = {reportKey: 12345},
            controller = Environment.render(<ReportController params={params}/>),
            state = controller.state;
        expect(Actions.loadReport).toHaveBeenCalledWith(params.reportKey);
        expect(state.loading).toBeTruthy();
        expect(state.report).toBeNull();
    });

    it('Initializes new report when no key is specified', function () {
        var controller = Environment.render(<ReportController params={{}}/>),
            report = controller.state.report;

        expect(controller.state.loading).toBeFalsy();
        expect(report).toBeDefined();
        expect(report.isNew).toBeTruthy();
        expect(report.occurrence).toBeDefined();
        expect(report.occurrence.startTime).toBeDefined();
        expect(report.occurrence.endTime).toBeDefined();
    });
});
