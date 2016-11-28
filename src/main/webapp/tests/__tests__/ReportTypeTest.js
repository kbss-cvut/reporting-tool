'use strict';

describe('ReportType', function () {

    var ReportType = require('../../js/model/ReportType'),
        Generator = require('../environment/Generator').default,
        ReportFactory = require('../../js/model/ReportFactory'),
        OccurrenceReportController = require('../../js/components/report/occurrence/OccurrenceReportController');

    it('returns default detail controller for new report when getDetailController is called', function () {
        var report = ReportFactory.createOccurrenceReport(),

            controller = ReportType.getDetailController(report);
        expect(controller).toEqual(OccurrenceReportController);
    });
});
