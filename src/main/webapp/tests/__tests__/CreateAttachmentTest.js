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
import CreateAttachment from "../../js/components/report/attachment/CreateAttachment";
import Environment from "../environment/Environment";

describe('CreateAttachment', () => {

    let onSave;

    beforeEach(() => {
        onSave = jasmine.createSpy('onSave');
    });

    it('enables the Attach button only when the reference value is not empty', () => {
        let component = Environment.render(<CreateAttachment onSave={onSave}/>),
            inputs = TestUtils.scryRenderedDOMComponentsWithTag(component, 'input'),
            referenceInput = inputs.find((item) => item.name.indexOf('reference') !== -1),
            attachButton = TestUtils.findRenderedDOMComponentWithTag(component, 'button');
        expect(referenceInput).toBeDefined();
        expect(attachButton.disabled).toBeTruthy();
        referenceInput.value = 'document.pdf';
        TestUtils.Simulate.change(referenceInput);
        expect(attachButton.disabled).toBeFalsy();
    });

    it('resets the inputs after save', () => {
        let component = Environment.render(<CreateAttachment onSave={onSave}/>),
            inputs = TestUtils.scryRenderedDOMComponentsWithTag(component, 'input'),
            attachButton = TestUtils.findRenderedDOMComponentWithTag(component, 'button'),
            value = 'Value';
        inputs.forEach(input => {
            input.value = value;
            TestUtils.Simulate.change(input);
        });
        TestUtils.Simulate.click(attachButton);
        expect(onSave).toHaveBeenCalled();
        expect(onSave.calls.argsFor(0)[0].reference).toEqual(value);
        expect(onSave.calls.argsFor(0)[0].description).toEqual(value);
        inputs.forEach((input) => {
            expect(input.value.length).toEqual(0);
        });
    });
});