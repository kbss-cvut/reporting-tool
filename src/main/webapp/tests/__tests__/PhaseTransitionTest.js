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