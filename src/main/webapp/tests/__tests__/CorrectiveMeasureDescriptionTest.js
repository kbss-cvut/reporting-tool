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
