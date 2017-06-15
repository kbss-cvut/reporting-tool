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