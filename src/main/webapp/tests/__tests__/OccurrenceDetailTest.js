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

describe('OccurrenceDetail', function () {

    var React = require('react'),
        assign = require('object-assign'),
        Environment = require('../environment/Environment'),
        Constants = require('../../js/constants/Constants'),
        ReportFactory = require('../../js/model/ReportFactory'),
        OccurrenceDetail = require('../../js/components/report/occurrence/Occurrence');

    it('Sets occurrence end time to the same as start time when start time is edited for the first time in a new report', function () {
        var report = ReportFactory.createOccurrenceReport(),
            onChange = jasmine.createSpy('onChange'),
            detail = Environment.render(<OccurrenceDetail report={report} onChange={onChange}/>);

        var newStart = report.occurrence.startTime - 100000;
        detail.onStartChange(newStart);
        expect(onChange).toHaveBeenCalled();
        var expected = assign({}, report.occurrence);
        expected.startTime = newStart;
        expected.endTime = newStart + Constants.MINUTE;
        expect(onChange).toHaveBeenCalledWith({'occurrence': expected});
    });

    it('Change occurrence end only on first edit of occurrence start', function () {
        var report = ReportFactory.createOccurrenceReport(),
            onChange = jasmine.createSpy('onChange'),
            detail = Environment.render(<OccurrenceDetail report={report} onChange={onChange}/>);
        var newStart = report.occurrence.startTime - 100000;
        detail.onStartChange(newStart);
        expect(onChange.calls.argsFor(0)[0].occurrence.endTime).toEqual(newStart + Constants.MINUTE);
        newStart = newStart + Constants.MINUTE;
        detail.onStartChange(newStart);
        // The second call does nothing, so the end time should be the same as original
        expect(onChange.calls.argsFor(1)[0].occurrence.endTime).toEqual(report.occurrence.endTime);
        expect(onChange).toHaveBeenCalledTimes(2);
    });

    it('Does not modify occurrence end for existing reports', function () {
        var report = ReportFactory.createOccurrenceReport(),
            onChange = jasmine.createSpy('onChange'),
            detail = Environment.render(<OccurrenceDetail report={report} onChange={onChange}/>);
        delete report.isNew;
        var newStart = report.occurrence.startTime - Constants.MINUTE;
        detail.onStartChange(newStart);
        expect(onChange).toHaveBeenCalledTimes(1);
        var end = onChange.calls.argsFor(0)[0].occurrence.endTime;
        expect(end).toEqual(report.occurrence.endTime);
    });
});
