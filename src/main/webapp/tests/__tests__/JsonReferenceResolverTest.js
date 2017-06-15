'use strict';

import Generator from "../environment/Generator";
import JsonReferenceResolver from "../../js/utils/JsonReferenceResolver";
import Vocabulary from "../../js/constants/Vocabulary";

describe('JSON reference resolver', () => {

    describe('resolveReferences', () => {
        it('resolves property value in circular reference', () => {
            var referenceId = Generator.getRandomInt(),
                data = {
                    referenceId: referenceId,
                    attOne: 'Test',
                    attTwo: {
                        attThree: 'TestII',
                        attFour: referenceId
                    }
                };
            JsonReferenceResolver.resolveReferences(data);
            expect(data.attTwo.attFour).toEqual(data);
        });

        it('resolves reference in array', () => {
            var referenceId = Generator.getRandomInt(),
                data = {
                    attOne: {
                        '@id': Generator.getRandomUri(),
                        referenceId: referenceId
                    },
                    attTwo: 'test',
                    attThree: {
                        attFour: [
                            referenceId,
                            {'@id': Generator.getRandomUri()},
                            {'@id': Generator.getRandomUri()}
                        ]
                    }
                };
            JsonReferenceResolver.resolveReferences(data);
            expect(data.attThree.attFour[0]).toEqual(data.attOne);
        });

        it('resolves reference to array in sibling', () => {
            var referenceId = Generator.getRandomInt(),
                data = {
                    findings: [{
                        uri: Generator.getRandomUri(),
                        correctiveMeasures: [{
                            description: 'Test',
                            referenceId: referenceId,
                        }, {
                            description: 'Test II',
                            referenceId: Generator.getRandomInt(),
                        }]
                    }, {
                        uri: Generator.getRandomUri(),
                        correctiveMeasures: [
                            referenceId,
                            {
                                description: 'Test III',
                                referenceId: Generator.getRandomInt(),
                            }
                        ]
                    }]
                };
            JsonReferenceResolver.resolveReferences(data);
            expect(data.findings[1].correctiveMeasures[0]).toEqual(data.findings[0].correctiveMeasures[0]);
        });
    });

    describe('encodeReferences', () => {
        it('encodes circular property using reference id', () => {
            var referenceId = Generator.getRandomInt(),
                data = {
                    uri: Generator.getRandomUri(),
                    referenceId: referenceId,
                    attOne: {
                        attTwo: 'Test'
                    }
                };
            data.attOne.attThree = data;
            JsonReferenceResolver.encodeReferences(data);
            expect(data.attOne.attThree).toEqual(data.referenceId);
        });

        it('encodes object reference in array', () => {
            var referenceId = Generator.getRandomInt(),
                data = {
                    attOne: {
                        uri: Generator.getRandomUri(),
                        referenceId: referenceId
                    },
                    attTwo: {
                        attThree: [{
                            uri: Generator.getRandomUri(),
                            description: 'Test'
                        }]
                    }
                };
            data.attTwo.attThree.push(data.attOne);
            JsonReferenceResolver.encodeReferences(data);
            expect(data.attTwo.attThree[data.attTwo.attThree.length - 1]).toEqual(data.attOne.referenceId);
        });
    });

    it('encodes object reference in array in sibling', () => {
        var referenceId = Generator.getRandomInt(),
            data = {
                findings: [{
                    uri: Generator.getRandomUri(),
                    correctiveMeasures: [{
                        description: 'Test',
                        referenceId: referenceId,
                    }, {
                        description: 'Test II',
                        referenceId: Generator.getRandomInt(),
                    }]
                }, {
                    uri: Generator.getRandomUri(),
                    correctiveMeasures: [
                        {
                            description: 'Test III',
                            referenceId: Generator.getRandomInt(),
                        }
                    ]
                }]
            };
        data.findings[1].correctiveMeasures.push(data.findings[0].correctiveMeasures[0]);
        JsonReferenceResolver.encodeReferences(data);
        expect(data.findings[1].correctiveMeasures[data.findings[1].correctiveMeasures.length - 1]).toEqual(data.findings[0].correctiveMeasures[0].referenceId);
    });

    it('does not encode object twice when it appears twice in parent', () => {
        var data = {
            safetyIssue: {
                basedOn: [{
                    referenceId: Generator.getRandomInt(),
                    name: 'Occurrence'
                }],
                referenceId: Generator.getRandomInt()
            },
            factorGraph: {
                nodes: [{
                    eventType: Generator.getRandomUri(),
                    referenceId: Generator.getRandomInt()
                }, {
                    eventType: Generator.getRandomUri(),
                    referenceId: Generator.getRandomInt()
                }]
            }
        };
        data.factorGraph.nodes.splice(0, 0, data.safetyIssue);
        data.factorGraph.edges = [{
            from: data.factorGraph.nodes[0],
            to: data.factorGraph.nodes[1],
            linkType: Vocabulary.HAS_PART
        }, {
            from: data.factorGraph.nodes[0],
            to: data.factorGraph.nodes[2],
            linkType: Vocabulary.HAS_PART
        }];
        JsonReferenceResolver.encodeReferences(data);
        expect(typeof data.safetyIssue.basedOn[0]).toEqual('object');
        expect(data.factorGraph.nodes[0]).toEqual(data.safetyIssue.referenceId);
        expect(data.factorGraph.edges[0].from).toEqual(data.safetyIssue.referenceId);
        expect(data.factorGraph.edges[0].to).toEqual(data.factorGraph.nodes[1].referenceId);
        expect(data.factorGraph.edges[1].from).toEqual(data.safetyIssue.referenceId);
        expect(data.factorGraph.edges[1].to).toEqual(data.factorGraph.nodes[2].referenceId);
    });
});
