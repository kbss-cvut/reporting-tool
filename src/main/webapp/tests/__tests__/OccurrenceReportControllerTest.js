'use strict';

describe('Occurrence report controller', function () {

    const React = require('react'),
        Button = require('react-bootstrap').Button,
        assign = require('object-assign'),
        rewire = require('rewire'),
        TestUtils = require('react-addons-test-utils'),
        Environment = require('../environment/Environment'),
        Actions = require('../../js/actions/Actions'),
        Constants = require('../../js/constants/Constants'),
        Generator = require('../environment/Generator').default,
        InvalidReportTimeFix = require('../../js/components/report/occurrence/InvalidReportTimeFix').default,
        messages = require('../../js/i18n/en').messages,
        ReportController = rewire('../../js/components/report/occurrence/OccurrenceReportController'),
        OccurrenceReport = rewire('../../js/components/report/occurrence/OccurrenceReport'),
        ReportNotRenderable = require('../../js/components/ReportNotRenderable').default;

    beforeEach(function () {
        spyOn(Actions, 'loadOptions');
        Environment.mockFactors(OccurrenceReport);
        ReportController.__set__('ReportDetail', OccurrenceReport);
    });

    it('shows only Cancel button if the displayed report is not the latest revision.', function () {
        const report = Generator.generateOccurrenceReport(),
            revisions = [
                {
                    revision: 2,
                    key: 54321
                },
                {
                    revision: report.revision,
                    key: report.key
                }
            ],
            expectedButtons = ['Cancel'],
            hiddenButtons = ['Save', 'Submit to authority'];
        let i, len;
        spyOn(Actions, 'loadReport');
        spyOn(Actions, 'loadRevisions');
        const result = Environment.render(<ReportController report={report} revisions={revisions}/>);

        for (i = 0, len = expectedButtons.length; i < len; i++) {
            expect(getButton(result, expectedButtons[i])).not.toBeNull();
        }
        for (i = 0, len = hiddenButtons.length; i < len; i++) {
            expect(getButton(result, hiddenButtons[i])).toBeNull();
        }
    });

    function getButton(root, text) {
        return Environment.getComponentByText(root, Button, text);
    }

    it('updates report state when onChange is called.', function () {
        const report = Generator.generateOccurrenceReport(),
            newSummary = 'New investigation summary.';
        spyOn(Actions, 'loadReport');
        spyOn(Actions, 'loadRevisions');
        const result = Environment.render(<ReportController report={report}/>);

        result.onChange({summary: newSummary});
        expect(result.state.report.summary).toEqual(newSummary);
    });

    it('calls loadReport when revision is selected.', function () {
        const report = Generator.generateOccurrenceReport(),
            selectedRevision = {revision: 2, key: '111222333'};
        spyOn(Actions, 'loadReport');
        spyOn(Actions, 'loadRevisions');
        const result = Environment.render(<ReportController report={report}/>);
        spyOn(result, 'loadReport');

        result.onRevisionSelected(selectedRevision);
        expect(result.loadReport).toHaveBeenCalledWith(selectedRevision.key);
    });

    it('reloads report on save success.', function () {
        const report = Generator.generateOccurrenceReport();
        spyOn(Actions, 'loadReport');
        const result = Environment.render(<ReportController report={report}/>);

        result.onSuccess();
        expect(Actions.loadReport).toHaveBeenCalled();
    });

    it('shows not renderable error when report cannot be rendered', function () {
        const report = Generator.generateOccurrenceReport();
        report.occurrence.startTime = Date.now() - Constants.MAX_OCCURRENCE_START_END_DIFF - 1000;
        report.occurrence.endTime = Date.now();

        const rendered = Environment.render(<ReportController report={report}/>),
            notRenderableError = TestUtils.findRenderedComponentWithType(rendered, ReportNotRenderable);
        expect(notRenderableError).not.toBeNull();
    });

    it('shows not renderable error when occurrence start is much smaller than sub-event start', () => {
        const report = Generator.generateOccurrenceReport();
        report.factorGraph = {};
        report.factorGraph.nodes = Generator.generateFactorGraphNodes();
        report.factorGraph.nodes.splice(0, 0, report.occurrence);
        report.factorGraph.edges = Generator.generatePartOfLinksForNodes(report.occurrence, report.factorGraph.nodes);
        report.occurrence.startTime = report.factorGraph.nodes[1].startTime - Constants.MAX_OCCURRENCE_START_END_DIFF - 10000;
        report.occurrence.endTime = report.occurrence.startTime + 1000;

        const component = Environment.render(<ReportController report={report}/>),
            notRenderableError = TestUtils.findRenderedComponentWithType(component, ReportNotRenderable);
        expect(notRenderableError).not.toBeNull();
    });

    it('offers resolution of time-based errors causing report not to be renderable', () => {
        const report = Generator.generateOccurrenceReport();
        report.occurrence.startTime = Date.now() - Constants.MAX_OCCURRENCE_START_END_DIFF - 1000;
        report.occurrence.endTime = Date.now();

        const rendered = Environment.render(<ReportController report={report}/>),
            fixButton = Environment.getComponentByTagAndText(rendered, 'button', messages['issue-fix']);
        expect(fixButton).not.toBeNull();
    });

    it('shows report fix view when user chooses to resolve the issue with report not being renderable', () => {
        const report = Generator.generateOccurrenceReport();
        report.occurrence.startTime = Date.now() - Constants.MAX_OCCURRENCE_START_END_DIFF - 1000;
        report.occurrence.endTime = Date.now();

        const rendered = Environment.render(<ReportController report={report}/>),
            fixButton = Environment.getComponentByTagAndText(rendered, 'button', messages['issue-fix']);
        TestUtils.Simulate.click(fixButton);
        const fixView = TestUtils.findRenderedComponentWithType(rendered, InvalidReportTimeFix);
        expect(fixView).not.toBeNull();
    });

    it('updates report occurrence when changes are being made in the fix view', () => {
        const report = Generator.generateOccurrenceReport();
        report.occurrence.startTime = Date.now() - Constants.MAX_OCCURRENCE_START_END_DIFF - 1000;
        report.occurrence.endTime = Date.now();

        const rendered = Environment.render(<ReportController report={report}/>);
        spyOn(rendered, "onChange").and.callThrough();
        rendered._onFixRenderingIssue();
        const fixView = TestUtils.findRenderedComponentWithType(rendered, InvalidReportTimeFix.WrappedComponent);
        const newStart = Date.now();
        fixView.getWrappedComponent()._onStartChange(report.occurrence, newStart.toString());
        expect(rendered.onChange).toHaveBeenCalled();
        expect(report.occurrence.startTime).toEqual(newStart);
    });

    it('updates report factor graph when change to event occurs in the fix view', () => {
        const report = Generator.generateOccurrenceReport();
        report.factorGraph = {};
        report.factorGraph.nodes = Generator.generateFactorGraphNodes();
        report.factorGraph.nodes.splice(0, 0, report.occurrence);
        report.factorGraph.edges = Generator.generatePartOfLinksForNodes(report.occurrence, report.factorGraph.nodes);
        report.occurrence.startTime = Date.now() - Constants.MAX_OCCURRENCE_START_END_DIFF - 1000;
        report.occurrence.endTime = Date.now();

        const rendered = Environment.render(<ReportController report={report}/>);
        spyOn(rendered, "onChange").and.callThrough();
        rendered._onFixRenderingIssue();
        const fixView = TestUtils.findRenderedComponentWithType(rendered, InvalidReportTimeFix.WrappedComponent),
            newStart = Date.now(),
            index = Generator.getRandomPositiveInt(1, report.factorGraph.nodes.length),
            node = report.factorGraph.nodes[index];
        fixView.getWrappedComponent()._onStartChange(node, newStart.toString());
        expect(rendered.onChange).toHaveBeenCalled();
        expect(report.factorGraph.nodes[index].startTime).toEqual(newStart);
    });

    it('updates occurrence and factor graph when change to occurrence occurs in the fix view', () => {
        const report = Generator.generateOccurrenceReport();
        report.factorGraph = {};
        report.factorGraph.nodes = Generator.generateFactorGraphNodes();
        report.factorGraph.nodes.splice(0, 0, report.occurrence);
        report.factorGraph.edges = Generator.generatePartOfLinksForNodes(report.occurrence, report.factorGraph.nodes);
        report.occurrence.startTime = Date.now() - Constants.MAX_OCCURRENCE_START_END_DIFF - 1000;
        report.occurrence.endTime = Date.now();

        const rendered = Environment.render(<ReportController report={report}/>);
        spyOn(rendered, "onChange").and.callThrough();
        rendered._onFixRenderingIssue();
        const fixView = TestUtils.findRenderedComponentWithType(rendered, InvalidReportTimeFix.WrappedComponent);
        const newStart = Date.now();
        fixView.getWrappedComponent()._onStartChange(report.occurrence, newStart.toString());
        expect(rendered.onChange).toHaveBeenCalled();
        expect(report.occurrence.startTime).toEqual(newStart);
        expect(report.factorGraph.nodes[0].startTime).toEqual(newStart);
        expect(report.occurrence).toEqual(report.factorGraph.nodes[0]);
    });

    it('replaces original event with new one in factor graph edges when change to the event occurs in the fix view', () => {
        const report = Generator.generateOccurrenceReport();
        report.factorGraph = {};
        report.factorGraph.nodes = Generator.generateFactorGraphNodes();
        report.factorGraph.nodes.splice(0, 0, report.occurrence);
        report.factorGraph.edges = Generator.generatePartOfLinksForNodes(report.occurrence, report.factorGraph.nodes);
        report.occurrence.startTime = Date.now() - Constants.MAX_OCCURRENCE_START_END_DIFF - 1000;
        report.occurrence.endTime = Date.now();
        const originalEdges = report.factorGraph.edges.slice();

        const rendered = Environment.render(<ReportController report={report}/>);
        spyOn(rendered, "onChange").and.callThrough();
        rendered._onFixRenderingIssue();
        const fixView = TestUtils.findRenderedComponentWithType(rendered, InvalidReportTimeFix.WrappedComponent),
            newStart = Date.now(),
            node = report.factorGraph.edges[Generator.getRandomInt(report.factorGraph.edges.length)].from,
            index = report.factorGraph.nodes.indexOf(node);
        expect(index).not.toEqual(-1);
        fixView.getWrappedComponent()._onStartChange(node, newStart.toString());
        expect(rendered.onChange).toHaveBeenCalled();
        for (let i = 0, len = originalEdges.length; i < len; i++) {
            if (originalEdges[i].from === node) {
                expect(report.factorGraph.edges[i].from).toEqual(report.factorGraph.nodes[index]);
            }
            if (originalEdges[i].to === node) {
                expect(report.factorGraph.edges[i].to).toEqual(report.factorGraph.nodes[index]);
            }
        }
    });

    it('does not show time diff issue when occurrence start time changes in report', () => {
        const report = Generator.generateOccurrenceReport();
        report.factorGraph = {};
        report.factorGraph.nodes = [report.occurrence];
        const component = Environment.render(<ReportController report={report}/>);
        let notRenderableError = TestUtils.scryRenderedComponentsWithType(component, ReportNotRenderable.WrappedComponent);
        expect(notRenderableError.length).toEqual(0);
        const occurrenceUpdate = assign({}, report.occurrence);
        occurrenceUpdate.startTime = Date.now() - 127 * 3600 * 1000;
        occurrenceUpdate.endTime = occurrenceUpdate.startTime + 1000;
        component.onChange({occurrence: occurrenceUpdate});
        notRenderableError = TestUtils.scryRenderedComponentsWithType(component, ReportNotRenderable.WrappedComponent);
        expect(notRenderableError.length).toEqual(0);
    });
});
