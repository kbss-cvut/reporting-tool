'use strict';

describe('OccurrenceReport', function () {

    var React = require('react'),
        rewire = require('rewire'),
        Environment = require('../environment/Environment'),
        Generator = require('../environment/Generator').default,
        Actions = require('../../js/actions/Actions'),
        ReportFactory = require('../../js/model/ReportFactory'),
        OccurrenceReport = rewire('../../js/components/report/occurrence/OccurrenceReport'),
        messages = require('../../js/i18n/en'),
        handlers,
        report;

    beforeEach(function () {
        spyOn(Actions, 'updateReport');
        spyOn(Actions, 'loadOptions');
        handlers = jasmine.createSpyObj('handlers', ['onCancel', 'onSuccess', 'onChange']);
        Environment.mockFactors(OccurrenceReport);
        report = Generator.generateOccurrenceReport();
    });

    it('Gets factor graph on submit', () => {
        var component = Environment.render(<OccurrenceReport report={report} handlers={handlers}/>),
            saveEvent = {
                preventDefault: function () {
                }
            },
            FactorJsonSerializer = OccurrenceReport.__get__('Factors').__get__('FactorJsonSerializer');
        component.onSave(saveEvent);
        expect(FactorJsonSerializer.getFactorGraph).toHaveBeenCalled();
    });

    it('calls createReport when new report is saved', () => {
        report.isNew = true;
        spyOn(Actions, 'createReport');
        var component = Environment.render(<OccurrenceReport report={report} handlers={handlers}/>),
            saveEvent = {
                preventDefault: function () {
                }
            },
            FactorJsonSerializer = OccurrenceReport.__get__('Factors').__get__('FactorJsonSerializer');
        component.onSave(saveEvent);

        expect(Actions.createReport).toHaveBeenCalled();
    });

    it('calls updateReport when an existing report is saved', () => {
        var component = Environment.render(<OccurrenceReport report={report} handlers={handlers}/>),
            saveEvent = {
                preventDefault: function () {
                }
            },
            FactorJsonSerializer = OccurrenceReport.__get__('Factors').__get__('FactorJsonSerializer');
        component.onSave(saveEvent);

        expect(Actions.updateReport).toHaveBeenCalled();
    });

    it('does not display report file number when it is not defined (e.g. for new reports.)', () => {
        report = ReportFactory.createOccurrenceReport();
        var component = Environment.render(<OccurrenceReport report={report} handlers={handlers}/>);
        expect(Environment.getComponentByTagAndContainedText(component, 'h3', messages['fileNo'])).toBeNull();
    })
});