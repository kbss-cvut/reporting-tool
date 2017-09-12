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
import TestUtils from "react-addons-test-utils";
import Environment from "../environment/Environment";
import Generator from "../environment/Generator";

import Wizard from "../../js/components/wizard/Wizard";
import WizardStore from "../../js/stores/WizardStore";

describe('Wizard', () => {
    let steps;

    // Testing wizard step component
    class StepComponent extends React.Component {

        render() {
            return null;
        }
    }

    it('harvests data from WizardStore on finish', () => {
        steps = initSteps(1);
        const data = {
                id: Generator.getRandomInt()
            }, stepData = [
                {}, {}, {}
            ],
            onFinish = jasmine.createSpy('onFinish');
        onFinish.and.callFake((wizardData) => {
            expect(wizardData.data).toEqual(data);
            expect(wizardData.stepData).toEqual(stepData);
        });
        WizardStore.initWizard(data, stepData);
        const component = Environment.render(<Wizard steps={steps} onFinish={onFinish}/>);
        component.onFinish();
        expect(onFinish).toHaveBeenCalled();
    });

    function initSteps(count) {
        const steps = [];
        for (let i = 0; i < count; i++) {
            steps.push({
                id: i,
                name: 'Test-' + i,
                component: StepComponent
            });
        }
        return steps;
    }

    it('supports inserting step into wizard', () => {
        const origLength = 5;
        steps = initSteps(origLength);
        const stepToInsert = {
                name: 'Inserted step',
                component: StepComponent,
                data: {
                    id: 117
                }
            },
            stepData = steps.map((item) => {
                return {id: item.name}
            }),
            insertAfter = Generator.getRandomInt(steps.length);
        WizardStore.initWizard(null, stepData);
        const component = Environment.render(<Wizard steps={steps} onFinish={jasmine.createSpy('onFinish')}/>);
        for (let i = 0; i < insertAfter; i++) {
            component.onAdvance();
        }
        component.onInsertStepAfterCurrent(stepToInsert);
        expect(component.props.steps.length).toEqual(origLength + 1);
        expect(WizardStore.getStepData().length).toEqual(origLength + 1);
        expect(component.props.steps[insertAfter + 1]).toEqual(stepToInsert);
        const data = WizardStore.getStepData(insertAfter + 1);
        expect(data).toEqual(stepToInsert.data);
    });

    it('supports adding step to the end of the wizard', () => {
        const origLength = 5;
        steps = initSteps(origLength);
        const stepToInsert = {
                name: 'Inserted step',
                component: StepComponent,
                data: {
                    id: 117
                }
            },
            stepData = steps.map((item) => {
                return {id: item.name}
            });
        WizardStore.initWizard(null, stepData);
        const component = Environment.render(<Wizard steps={steps} onFinish={jasmine.createSpy('onFinish')}/>);

        component.onAddStep(stepToInsert);
        expect(component.props.steps.length).toEqual(origLength + 1);
        expect(WizardStore.getStepData().length).toEqual(origLength + 1);
        expect(component.props.steps[origLength]).toEqual(stepToInsert);
        const data = WizardStore.getStepData(origLength);
        expect(data).toEqual(stepToInsert.data);
    });

    it('supports step removal', () => {
        const origLength = 5;
        steps = initSteps(origLength);
        const toRemove = Generator.getRandomInt(origLength),
            stepData = steps.map((item) => {
                return {id: item.name}
            });
        WizardStore.initWizard({test: 'test'}, stepData);
        const component = Environment.render(<Wizard steps={steps} onFinish={jasmine.createSpy('onFinish')}/>);

        component.onRemoveStep(steps[toRemove].id);
        expect(component.props.steps.length).toEqual(origLength - 1);
        expect(WizardStore.getStepData().length).toEqual(origLength - 1);
    });

    it('supports removal of the first step', () => {
        const origLength = 5;
        steps = initSteps(origLength);
        const toRemove = 0,
            stepData = steps.map((item) => {
                return {id: item.name}
            });
        WizardStore.initWizard({test: 'test'}, stepData);
        const component = Environment.render(<Wizard steps={steps} onFinish={jasmine.createSpy('onFinish')}/>);

        component.onRemoveStep(steps[toRemove].id);
        expect(component.props.steps.length).toEqual(origLength - 1);
        expect(WizardStore.getStepData().length).toEqual(origLength - 1);
        expect(component.state.currentStep).toEqual(0);
    });

    it('marks steps as visited as onAdvance is called', () => {
        steps = initSteps(Generator.getRandomPositiveInt(2, 10));
        WizardStore.initWizard();
        const component = Environment.render(<Wizard steps={steps} onFinish={jasmine.createSpy('onFinish')}/>);

        for (let i = 0, len = steps.length - 1; i < len; i++) {
            expect(steps[i].visited).toBeTruthy();
            expect(component.state.currentStep).toEqual(i);
            component.onAdvance();
            expect(steps[i + 1].visited).toBeTruthy();
            expect(component.state.currentStep).toEqual(i + 1);
        }
    });

    it('starts wizard at the specified index when it is provided', () => {
        steps = initSteps(Generator.getRandomPositiveInt(2, 10));
        WizardStore.initWizard();
        const startIndex = Generator.getRandomPositiveInt(1, steps.length),
            component = Environment.render(<Wizard steps={steps} onFinish={jasmine.createSpy('onFinish')}
                                                   start={startIndex}/>);

        expect(component.state.currentStep).toEqual(startIndex);
    });

    it('resets the WizardStore on finish', () => {
        steps = initSteps(1);
        const data = {
                id: Generator.getRandomInt()
            }, stepData = [
                {}, {}, {}
            ],
            onFinish = jasmine.createSpy('onFinish');
        spyOn(WizardStore, 'reset').and.callThrough();
        WizardStore.initWizard(data, stepData);
        const component = Environment.render(<Wizard steps={steps} onFinish={onFinish}/>);
        component.onFinish();
        expect(onFinish).toHaveBeenCalled();
        expect(WizardStore.reset).toHaveBeenCalled();
    });

    it('renders info and nothing else when no steps are provided', () => {
        steps = [];
        const onFinish = jasmine.createSpy('onFinish'),
            component = Environment.render(<Wizard steps={steps} onFinish={onFinish}/>);

        const content = TestUtils.scryRenderedComponentsWithType(component, require('../../js/components/wizard/WizardStep'));
        expect(content.length).toEqual(0);
        const info = Environment.getComponentByTagAndText(component, 'div', 'There are no steps in this wizard.');
        expect(info).toBeDefined();
        expect(info).not.toBeNull();
    });
});
