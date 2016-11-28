'use strict';

describe('Report', function () {

    var React = require('react'),
        TestUtils = require('react-addons-test-utils'),
        Environment = require('../environment/Environment'),
        Generator = require('../environment/Generator').default,
        Constants = require('../../js/constants/Constants'),
        Report = require('../../js/components/report/Report').default,
        ResourceNotFound = require('../../js/components/ResourceNotFound'),
        ReportNotRenderable = require('../../js/components/ReportNotRenderable');

    it('shows not found error when report is not found', function () {
        var rendered = Environment.render(<Report loading={false} report={null}/>),
            notFoundError = TestUtils.findRenderedComponentWithType(rendered, ResourceNotFound);
        expect(notFoundError).not.toBeNull();
    });

    it('shows not renderable error when report cannot be rendered', function () {
        var report = Generator.generateOccurrenceReport();
        report.occurrence.startTime = Date.now() - Constants.MAX_OCCURRENCE_START_END_DIFF - 1000;
        report.occurrence.endTime = Date.now();

        var rendered = Environment.render(<Report loading={false} report={report}/>),
            notRenderableError = TestUtils.findRenderedComponentWithType(rendered, ReportNotRenderable);
        expect(notRenderableError).not.toBeNull();
    })
});