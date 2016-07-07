'use strict';

describe('Wizard', () => {

    var React = require('react'),
        TestUtils = require('react-addons-test-utils'),
        Environment = require('../environment/Environment'),
        Generator = require('../environment/Generator').default,

        Wizard = require('../../js/components/wizard/Wizard'),
        WizardStore = require('../../js/stores/WizardStore'),
        steps;

    // Testing wizard step component
    var StepComponent = React.createClass({

        render: function () {
            return null;
        }
    });

    it('harvests data from WizardStore on finish', () => {
        steps = initSteps(1);
        var data = {
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
        var component = Environment.render(<Wizard steps={steps} onFinish={onFinish}/>);
        component.onFinish();
        expect(onFinish).toHaveBeenCalled();
    });

    function initSteps(count) {
        var steps = [];
        for (var i = 0; i < count; i++) {
            steps.push({
                id: i,
                name: 'Test-' + i,
                component: StepComponent
            });
        }
        return steps;
    }

    it('supports inserting step into wizard', () => {
        var origLength = 5;
        steps = initSteps(origLength);
        var stepToInsert = {
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
        var component = Environment.render(<Wizard steps={steps} onFinish={jasmine.createSpy('onFinish')}/>);
        for (var i = 0; i < insertAfter; i++) {
            component.onAdvance();
        }
        component.onInsertStepAfterCurrent(stepToInsert);
        expect(component.props.steps.length).toEqual(origLength + 1);
        expect(WizardStore.getStepData().length).toEqual(origLength + 1);
        expect(component.props.steps[insertAfter + 1]).toEqual(stepToInsert);
        var data = WizardStore.getStepData(insertAfter + 1);
        expect(data).toEqual(stepToInsert.data);
    });

    it('supports adding step to the end of the wizard', () => {
        var origLength = 5;
        steps = initSteps(origLength);
        var stepToInsert = {
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
        var component = Environment.render(<Wizard steps={steps} onFinish={jasmine.createSpy('onFinish')}/>);

        component.onAddStep(stepToInsert);
        expect(component.props.steps.length).toEqual(origLength + 1);
        expect(WizardStore.getStepData().length).toEqual(origLength + 1);
        expect(component.props.steps[origLength]).toEqual(stepToInsert);
        var data = WizardStore.getStepData(origLength);
        expect(data).toEqual(stepToInsert.data);
    });

    it('supports step removal', () => {
        var origLength = 5;
        steps = initSteps(origLength);
        var toRemove = Generator.getRandomInt(origLength),
            stepData = steps.map((item) => {
                return {id: item.name}
            });
        WizardStore.initWizard({test: 'test'}, stepData);
        var component = Environment.render(<Wizard steps={steps} onFinish={jasmine.createSpy('onFinish')}/>);

        component.onRemoveStep(steps[toRemove].id);
        expect(component.props.steps.length).toEqual(origLength - 1);
        expect(WizardStore.getStepData().length).toEqual(origLength - 1);
    });

    it('supports removal of the first step', () => {
        var origLength = 5;
        steps = initSteps(origLength);
        var toRemove = 0,
            stepData = steps.map((item) => {
                return {id: item.name}
            });
        WizardStore.initWizard({test: 'test'}, stepData);
        var component = Environment.render(<Wizard steps={steps} onFinish={jasmine.createSpy('onFinish')}/>);

        component.onRemoveStep(steps[toRemove].id);
        expect(component.props.steps.length).toEqual(origLength - 1);
        expect(WizardStore.getStepData().length).toEqual(origLength - 1);
        expect(component.state.currentStep).toEqual(0);
    });

    it('marks steps as visited as onAdvance is called', () => {
        steps = initSteps(Generator.getRandomPositiveInt(2, 10));
        WizardStore.initWizard();
        var component = Environment.render(<Wizard steps={steps} onFinish={jasmine.createSpy('onFinish')}/>);

        for (var i = 0, len = steps.length - 1; i < len; i++) {
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
        var startIndex = Generator.getRandomPositiveInt(1, steps.length);
        var component = Environment.render(<Wizard steps={steps} onFinish={jasmine.createSpy('onFinish')}
                                                   start={startIndex}/>);

        expect(component.state.currentStep).toEqual(startIndex);
    });

    it('resets the WizardStore on finish', () => {
        steps = initSteps(1);
        var data = {
                id: Generator.getRandomInt()
            }, stepData = [
                {}, {}, {}
            ],
            onFinish = jasmine.createSpy('onFinish');
        spyOn(WizardStore, 'reset').and.callThrough();
        WizardStore.initWizard(data, stepData);
        var component = Environment.render(<Wizard steps={steps} onFinish={onFinish}/>);
        component.onFinish();
        expect(onFinish).toHaveBeenCalled();
        expect(WizardStore.reset).toHaveBeenCalled();
    });

    it('renders info and nothing else when no steps are provided', () => {
        steps = [];
        var onFinish = jasmine.createSpy('onFinish'),
            component = Environment.render(<Wizard steps={steps} onFinish={onFinish}/>);

        var content = TestUtils.scryRenderedComponentsWithType(component, require('../../js/components/wizard/WizardStep'));
        expect(content.length).toEqual(0);
        var info = Environment.getComponentByTagAndText(component, 'div', 'There are no steps in this wizard.');
        expect(info).toBeDefined();
        expect(info).not.toBeNull();
    });
});
