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

import React from "react";
import TestUtils from "react-addons-test-utils";
import Actions from "../../js/actions/Actions";
import Environment from "../environment/Environment";

import InitialReportImport from "../../js/components/report/initial/InitialReportImport";

describe('Initial report import', () => {

    let onImportFinish, onCancel;

    beforeEach(() => {
        spyOn(Actions, "importInitialReport");
        onImportFinish = jasmine.createSpy('onImportFinish');
        onCancel = jasmine.createSpy('onCancel');
    });

    it('passes imported text to the initialReportImport action', () => {
        const component = Environment.render(<InitialReportImport onImportFinish={onImportFinish}
                                                                  onCancel={onCancel}/>),
            text = 'Initial report text';
        const input = TestUtils.findRenderedDOMComponentWithTag(component.modalBody, 'textarea');
        input.value = text;
        TestUtils.Simulate.change(input, {target: input});
        const finishButton = TestUtils.scryRenderedDOMComponentsWithTag(component.modalFooter, 'button')[0];
        TestUtils.Simulate.click(finishButton);
        expect(Actions.importInitialReport).toHaveBeenCalled();
        const initial = Actions.importInitialReport.calls.argsFor(0)[0];
        expect(initial.description).toEqual(text);
    });

    it('passes new occurrence report instance containing imported initial report to onImportFinish', () => {
        const component = Environment.render(<InitialReportImport onImportFinish={onImportFinish}
                                                                  onCancel={onCancel}/>),
            text = 'Initial report text';
        const input = TestUtils.findRenderedDOMComponentWithTag(component.modalBody, 'textarea');
        input.value = text;
        TestUtils.Simulate.change(input, {target: input});
        const finishButton = TestUtils.scryRenderedDOMComponentsWithTag(component.modalFooter, 'button')[0];
        TestUtils.Simulate.click(finishButton);
        expect(Actions.importInitialReport).toHaveBeenCalled();
        const initial = Actions.importInitialReport.calls.argsFor(0)[0];
        expect(initial.description).toEqual(text);
        const newReport = {
            initialReport: {
                text
            }
        };
        component._onImportSuccess(newReport);
        expect(onImportFinish).toHaveBeenCalledWith(newReport);
    });

    it('displays error message when import fails', () => {
        const component = Environment.render(<InitialReportImport onImportFinish={onImportFinish}
                                                                  onCancel={onCancel}/>),
            text = 'Initial report text';
        const input = TestUtils.findRenderedDOMComponentWithTag(component.modalBody, 'textarea');
        input.value = text;
        TestUtils.Simulate.change(input, {target: input});
        const finishButton = TestUtils.scryRenderedDOMComponentsWithTag(component.modalFooter, 'button')[0];
        TestUtils.Simulate.click(finishButton);
        const onError = Actions.importInitialReport.calls.argsFor(0)[2];
        expect(onError).toBeDefined();
        onError({
            message: 'Error'
        });
        const errorMessage = TestUtils.findRenderedComponentWithType(Environment.getCurrentRenderingResult(),
            require('react-bootstrap').Alert);
        expect(errorMessage).toBeDefined();
    });
});
