/*
 * Copyright (C) 2017 Czech Technical University in Prague
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

        var cells = TestUtils.scryRenderedDOMComponentsWithClass(component, 'vertical-middle'),
            dateCell = cells[1];
        expect(dateCell.textContent).toMatch(/01-01-70 0(0|1):00/);
    });
});
