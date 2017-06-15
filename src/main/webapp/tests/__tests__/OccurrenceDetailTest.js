'use strict';

describe('OccurrenceDetail', function () {

    const React = require('react'),
        assign = require('object-assign'),
        Environment = require('../environment/Environment'),
        Constants = require('../../js/constants/Constants'),
        ReportFactory = require('../../js/model/ReportFactory'),
        OccurrenceDetail = require('../../js/components/report/occurrence/Occurrence').default;

    let onChange;

    beforeEach(() => {
        onChange = jasmine.createSpy('onChange');
    });

    it('sets occurrence end time to the same as start time when start time is edited for the first time in a new report', function () {
        const report = ReportFactory.createOccurrenceReport(),
            detail = Environment.render(<OccurrenceDetail report={report} onChange={onChange}/>);

        const newStart = report.occurrence.startTime - 100000;
        detail.onStartChange(newStart);
        expect(onChange).toHaveBeenCalled();
        const expected = assign({}, report.occurrence);
        expected.startTime = newStart;
        expected.endTime = newStart + Constants.MINUTE;
        expect(onChange).toHaveBeenCalledWith({'occurrence': expected});
    });

    it('moves the whole occurrence when start time changes', () => {
        const report = ReportFactory.createOccurrenceReport(),
            detail = Environment.render(<OccurrenceDetail report={report} onChange={onChange}/>),

            timeDiff = 100000,
            newStart = report.occurrence.startTime - timeDiff;
        delete report.isNew;
        detail.onStartChange(newStart);
        const change = onChange.calls.argsFor(0)[0];
        expect(change.occurrence.startTime).toEqual(newStart);
        expect(change.occurrence.endTime).toEqual(report.occurrence.endTime - timeDiff);
    });

    it('moves the whole occurrence when start time changes for the second time in a new report', function () {
        onChange.and.callFake(change => {
            assign(report, change)
        });
        const report = ReportFactory.createOccurrenceReport(),
            detail = Environment.render(<OccurrenceDetail report={report} onChange={onChange}/>),
            firstStart = report.occurrence.startTime - 100000,
            firstEnd = firstStart + Constants.MINUTE;
        detail.onStartChange(firstStart);
        expect(onChange.calls.argsFor(0)[0].occurrence.endTime).toEqual(firstEnd);
        const secondStart = firstStart + 15000,
            secondEnd = firstEnd + 15000;
        detail.onStartChange(secondStart);
        // The second call moves the whole occurrence
        expect(onChange.calls.argsFor(1)[0].occurrence.endTime).toEqual(secondEnd);
        expect(onChange).toHaveBeenCalledTimes(2);
    });

    it('ignores change to the start date when invalid value is entered', () => {
        const report = ReportFactory.createOccurrenceReport(),
            detail = Environment.render(<OccurrenceDetail report={report} onChange={onChange}/>);
        detail.onStartChange('Invalid date');
        expect(onChange).not.toHaveBeenCalled();
    });

    it('ignores change to the end date when invalid value is entered', () => {
        const report = ReportFactory.createOccurrenceReport(),
            detail = Environment.render(<OccurrenceDetail report={report} onChange={onChange}/>);
        detail.onEndChange('Invalid date');
        expect(onChange).not.toHaveBeenCalled();
    });
});
