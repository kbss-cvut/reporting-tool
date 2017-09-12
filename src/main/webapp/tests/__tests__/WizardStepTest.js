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
import React from "react";
import Environment from "../environment/Environment";

import {messages} from "../../js/i18n/en";
import WizardStep from "../../js/components/wizard/WizardStep";

describe("Wizard step", () => {

    class TestComponent extends React.Component {
        render() {
            return <div>test</div>;
        }
    }

    let onFinish;

    beforeEach(() => {
        onFinish = jasmine.createSpy('onFinish');
    });

    it('does not render Finish button for when read only is specified', () => {
        const component = Environment.render(<WizardStep isLastStep={true} component={TestComponent} readOnly={true}
                                                         stepIndex={0} onFinish={onFinish}/>),
            finishButton = Environment.getComponentByTagAndText(component, 'button', messages['wizard.finish']);
        expect(finishButton).toBeNull();
    });

    it('render Close instead of Cancel button when read only is specified', () => {
        const component = Environment.render(<WizardStep isLastStep={true} component={TestComponent} readOnly={true}
                                                         stepIndex={0} onFinish={onFinish}/>),
            cancelButton = Environment.getComponentByTagAndText(component, 'button', messages['cancel']),
            closeButton = Environment.getComponentByTagAndText(component, 'button', messages['close']);
        expect(cancelButton).toBeNull();
        expect(closeButton).not.toBeNull();
    });
});
