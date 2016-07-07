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

describe('Report', function () {

    var React = require('react'),
        TestUtils = require('react-addons-test-utils'),
        Environment = require('../environment/Environment'),
        Generator = require('../environment/Generator').default,
        Constants = require('../../js/constants/Constants'),
        Report = require('../../js/components/report/Report'),
        ResourceNotFound = require('../../js/components/ResourceNotFound'),
        ReportNotRenderable = require('../../js/components/ReportNotRenderable');

    it('shows not found error when report is not found', function () {
        var rendered = Environment.render(<Report loading={false} report={null}/>),
            notFoundError = TestUtils.findRenderedComponentWithType(rendered, ResourceNotFound.wrappedComponent);
        expect(notFoundError).not.toBeNull();
    });

    it('shows not renderable error when report cannot be rendered', function () {
        var report = Generator.generateOccurrenceReport();
        report.occurrence.startTime = Date.now() - Constants.MAX_OCCURRENCE_START_END_DIFF - 1000;
        report.occurrence.endTime = Date.now();

        var rendered = Environment.render(<Report loading={false} report={report}/>),
            notRenderableError = TestUtils.findRenderedComponentWithType(rendered, ReportNotRenderable.wrappedComponent);
        expect(notRenderableError).not.toBeNull();
    })
});