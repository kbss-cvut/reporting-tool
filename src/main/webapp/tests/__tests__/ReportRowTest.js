'use strict';

import React from "react";
import TestUtils from "react-addons-test-utils";
import Environment from "../environment/Environment";
import Generator from "../environment/Generator";
import ReportRow from "../../js/components/report/ReportRow";

describe('Report row', () => {

    var actions;

    beforeEach(() => {
        actions = jasmine.createSpyObj('actions', ['onEdit', 'onRemove']);
    });

    it('renders report date correctly when it is set to 0', () => {
        var report = Generator.generateReports()[0];
        report.date = 0;
        var component = Environment.renderIntoTable(<ReportRow actions={actions} report={report}/>);

        var cells = TestUtils.scryRenderedDOMComponentsWithClass(component, 'report-row'),
            dateCell = cells[1];
        expect(dateCell.textContent).toMatch(/01-01-70 0(0|1):00/);
    });
});
