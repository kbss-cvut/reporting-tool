'use strict';

describe('OccurrenceReport', function () {

    const React = require('react'),
        TestUtils = require('react-addons-test-utils'),
        rewire = require('rewire'),
        Environment = require('../environment/Environment'),
        Generator = require('../environment/Generator').default,
        Actions = require('../../js/actions/Actions'),
        ReportFactory = require('../../js/model/ReportFactory'),
        OccurrenceReport = rewire('../../js/components/report/occurrence/OccurrenceReport'),
        messages = require('../../js/i18n/en').messages;
    let handlers,
        report;

    beforeEach(function () {
        spyOn(Actions, 'updateReport');
        spyOn(Actions, 'loadOptions');
        handlers = jasmine.createSpyObj('handlers', ['onCancel', 'onSuccess', 'onChange']);
        Environment.mockFactors(OccurrenceReport);
        report = Generator.generateOccurrenceReport();
    });

    it('Gets factor graph on submit', () => {
        const component = Environment.render(<OccurrenceReport report={report} handlers={handlers}/>),
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
        const component = Environment.render(<OccurrenceReport report={report} handlers={handlers}/>),
            saveEvent = {
                preventDefault: function () {
                }
            },
            FactorJsonSerializer = OccurrenceReport.__get__('Factors').__get__('FactorJsonSerializer');
        component.onSave(saveEvent);

        expect(Actions.createReport).toHaveBeenCalled();
    });

    it('calls updateReport when an existing report is saved', () => {
        const component = Environment.render(<OccurrenceReport report={report} handlers={handlers}/>),
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
        const component = Environment.render(<OccurrenceReport report={report} handlers={handlers}/>);
        expect(Environment.getComponentByTagAndContainedText(component, 'h3', messages['fileNo'])).toBeNull();
    });

    it('does not display \'Create new revision\' button for new reports', () => {
        report = ReportFactory.createOccurrenceReport();
        const component = Environment.render(<OccurrenceReport report={report} handlers={handlers}/>);
        expect(Environment.getComponentByTagAndText(component, 'a', messages['detail.submit'])).toBeNull();
    });

    it('renders factors with graph when standard desktop system is used to display the app', () => {
        report = ReportFactory.createOccurrenceReport();
        const component = Environment.render(<OccurrenceReport report={report} handlers={handlers}/>),
            factors = TestUtils.findRenderedDOMComponentWithClass(component, 'factors-gantt');
        expect(factors).toBeDefined();
        expect(factors).not.toBeNull();
    });

    it('renders factors in table when touch-based system is used to display the app', () => {
        report = ReportFactory.createOccurrenceReport();
        const deviceMock = function () {
            return {
                tablet: () => true,
                phone: () => true
            }
        };
        OccurrenceReport.__set__('device', deviceMock);
        const component = Environment.render(<OccurrenceReport report={report} handlers={handlers}/>),
            factors = TestUtils.findRenderedComponentWithType(component, require('../../js/components/factor/smallscreen/SmallScreenFactors').default.WrappedComponent);
        expect(factors).toBeDefined();
        expect(factors).not.toBeNull();
    });

    it('loading disables all bottom action buttons', () => {
        const component = Environment.render(<OccurrenceReport report={report} handlers={handlers}/>);
        component.onLoading();
        const toolbars = TestUtils.scryRenderedComponentsWithType(component, require('react-bootstrap').ButtonToolbar),
            toolbar = toolbars[toolbars.length - 1],
            buttons = TestUtils.scryRenderedDOMComponentsWithTag(toolbar, 'button');
        buttons.forEach(b => expect(b.disabled).toBeTruthy());
    });

    it('does not render Actions button for new report', () => {
        report = ReportFactory.createOccurrenceReport();
        const component = Environment.render(<OccurrenceReport report={report} handlers={handlers}/>),
            actionsButton = Environment.getComponentByTagAndContainedText(component, 'button', messages['table-actions']);
        expect(actionsButton).toBeNull();
    });

    it('does not display the summary button for new, unsaved report', () => {
        report = ReportFactory.createOccurrenceReport();
        const component = Environment.render(<OccurrenceReport report={report} handlers={handlers}/>),
            result = TestUtils.scryRenderedDOMComponentsWithClass(component, 'detail-top-button');
        expect(result.length).toEqual(0);
    });

    it('keeps the summary button disabled when report is missing required attributes', () => {
        report = ReportFactory.createOccurrenceReport();
        delete report.isNew;
        const component = Environment.render(<OccurrenceReport report={report} handlers={handlers}/>),
            summaryButton = TestUtils.findRenderedDOMComponentWithClass(component, 'detail-top-button');
        expect(summaryButton.disabled).toBeTruthy();
    });
});
