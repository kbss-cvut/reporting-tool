'use strict';

describe('PhaseTransition', () => {

    var React = require('react'),
        ReactDOM = require('react-dom'),
        TestUtils = require('react-addons-test-utils'),
        Environment = require('../environment/Environment'),
        Actions = require('../../js/actions/Actions'),
        OptionsStore = require('../../js/stores/OptionsStore'),
        Vocabulary = require('../../js/constants/Vocabulary'),

        PhaseTransition = require('../../js/components/misc/PhaseTransition').default,
        onLoading, onSuccess, onError,
        phases, report;

    beforeEach(() => {
        onLoading = jasmine.createSpy('onLoading');
        onSuccess = jasmine.createSpy('onSuccess');
        onError = jasmine.createSpy('onError');
        spyOn(Actions, 'loadOptions');
        phases = [
            {
                "@id": "http://onto.fel.cvut.cz/ontologies/documentation/not_processed",
                "http://www.w3.org/2000/01/rdf-schema#label": [{
                    "@language": "en",
                    "@value": "Not processed"
                }],
                "http://onto.fel.cvut.cz/ontologies/documentation/transition_label": [{
                    "@language": "en",
                    "@value": "Process"
                }]
            },
            {
                "@id": "http://onto.fel.cvut.cz/ontologies/documentation/processed",
                "http://www.w3.org/2000/01/rdf-schema#label": [{
                    "@language": "en",
                    "@value": "Processed"
                }],
                "http://onto.fel.cvut.cz/ontologies/documentation/transition_label": [{
                    "@language": "en",
                    "@value": "Submit to SAG"
                }]
            },
            {
                "@id": "http://onto.fel.cvut.cz/ontologies/documentation/sent_to_sag",
                "http://www.w3.org/2000/01/rdf-schema#label": [{
                    "@language": "en",
                    "@value": "Submitted to SAG"
                }]
            }
        ];
        report = {
            key: '12345',
            phase: 'http://onto.fel.cvut.cz/ontologies/documentation/not_processed'
        };
    });

    it('shows button for phase transition', () => {
        spyOn(OptionsStore, 'getOptions').and.returnValue(phases);
        var transitionLabel = phases[0][Vocabulary.TRANSITION_LABEL][0]['@value'],
            component = Environment.render(<PhaseTransition report={report} onLoading={onLoading} onSuccess={onSuccess}
                                                            onError={onError}/>),

            button = TestUtils.findRenderedComponentWithType(component, require('react-bootstrap').Button);
        expect(button).toBeDefined();
        expect(ReactDOM.findDOMNode(button).textContent).toEqual(transitionLabel);
    });

    it('shows button for phase transition when phases are loaded asynchronously', () => {
        spyOn(OptionsStore, 'getOptions').and.returnValue([]);
        var transitionLabel = phases[0][Vocabulary.TRANSITION_LABEL][0]['@value'],
            component = Environment.render(<PhaseTransition report={report} onLoading={onLoading} onSuccess={onSuccess}
                                                            onError={onError}/>),

            buttons = TestUtils.scryRenderedComponentsWithType(component, require('react-bootstrap').Button),
            button;
        expect(buttons.length).toEqual(0);
        expect(Actions.loadOptions).toHaveBeenCalledWith('reportingPhase');

        component._onPhasesLoaded('reportingPhase', phases);

        button = TestUtils.findRenderedComponentWithType(component, require('react-bootstrap').Button);
        expect(button).toBeDefined();
        expect(ReactDOM.findDOMNode(button).textContent).toEqual(transitionLabel);
    });

    it('shows nothing when the report is in the last phase', () => {
        // The last phase
        report.phase = phases[phases.length - 1]['@id'];
        spyOn(OptionsStore, 'getOptions').and.returnValue(phases);
        var component = Environment.render(<PhaseTransition report={report} onLoading={onLoading} onSuccess={onSuccess}
                                                            onError={onError}/>),

            buttons = TestUtils.scryRenderedComponentsWithType(component, require('react-bootstrap').Button);
        expect(buttons.length).toEqual(0);
    });

    it('triggers report loading when phase transition successfully finishes', () => {
        spyOn(OptionsStore, 'getOptions').and.returnValue(phases);
        spyOn(Actions, 'loadReport');
        spyOn(Actions, 'phaseTransition').and.callFake((rep, callback) => {
            expect(rep).toEqual(report);
            callback();
        });
        var component = Environment.render(<PhaseTransition report={report} onLoading={onLoading} onSuccess={onSuccess}
                                                            onError={onError}/>),

            button = TestUtils.findRenderedComponentWithType(component, require('react-bootstrap').Button);
        TestUtils.Simulate.click(ReactDOM.findDOMNode(button));
        expect(Actions.phaseTransition).toHaveBeenCalled();
        expect(onSuccess).toHaveBeenCalled();
    });
});