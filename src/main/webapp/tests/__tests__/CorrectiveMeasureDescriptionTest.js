'use strict';

import React from "react";
import TestUtils from "react-addons-test-utils";
import Environment from "../environment/Environment";
import Description from "../../js/components/correctivemeasure/wizard/Description";
import WizardStore from "../../js/stores/WizardStore";

describe('Corrective measure description', () => {

    let measure,
        handlers;

    beforeEach(() => {
        handlers = jasmine.createSpyObj('handlers', ['disableNext', 'enableNext', 'finish']);
        measure = {
            description: ''
        };
        WizardStore.initWizard({statement: measure}, []);
    });

    it('calls onFinish when Ctrl+Enter is pressed and text is not empty', () => {
        measure.description = 'Measure description';
        WizardStore.initWizard({statement: measure}, []);
        const component = Environment.render(<Description {...handlers}/>);
        TestUtils.Simulate.keyUp(component.descriptionInput.getInputDOMNode(), {
            key: 'Enter',
            keyCode: 13,
            which: 13,
            ctrlKey: true
        });
        expect(handlers.finish).toHaveBeenCalled();
    });
});
