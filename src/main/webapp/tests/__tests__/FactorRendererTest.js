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

describe('FactorRenderer', function () {

    var rewire = require('rewire'),
        FactorRenderer = rewire('../../js/components/factor/FactorRenderer'),
        Vocabulary = require('../../js/constants/Vocabulary'),
        Generator = require('../environment/Generator').default,
        GanttController,
        report;

    beforeEach(function () {
        GanttController = jasmine.createSpyObj('GanttController', ['addFactor', 'addLink', 'setOccurrenceEventId', 'setFactorParent', 'applyUpdates']);
        FactorRenderer.__set__('GanttController', GanttController);
        report = {
            occurrence: {
                uri: 'http://krizik.felk.cvut.cz/ontologies/inbas-2015#Occurrence_instance319360066',
                key: '25857640490956897',
                name: 'Runway incursion',
                eventType: Generator.randomCategory().id,
                startTime: 1447144734937,
                endTime: 1447144800937,
                referenceId: 1
            },
            created: 1447144867175,
            lastModified: 1447147087897,
            summary: 'Short report summary.',
            author: {
                uri: 'http://www.inbas.cz/ontologies/reporting-tool/people#Catherine+Halsey',
                firstName: 'Catherine',
                lastName: 'Halsey',
                username: 'halsey@unsc.org'
            },
            factorGraph: {
                nodes: [1]  // occurrence referenceId
            }

        }
    });

    it('Renders occurrence when factor graph is empty', () => {
        delete report.factorGraph;
        FactorRenderer.renderFactors(report);
        expect(GanttController.addFactor.calls.count()).toEqual(1);
        expect(GanttController.setOccurrenceEventId).toHaveBeenCalled();
        var arg = GanttController.addFactor.calls.argsFor(0)[0];
        verifyRoot(arg);
    });

    function verifyRoot(arg) {
        expect(arg.text).toEqual(report.occurrence.name);
        expect(arg.start_date.getTime()).toEqual(report.occurrence.startTime);
        expect(arg.end_date.getTime()).toEqual(report.occurrence.endTime);
        expect(arg.readonly).toBeTruthy();
        expect(arg.parent).not.toBeDefined();
    }

    it('Renders occurrence when it is the only node in factor graph', () => {
        FactorRenderer.renderFactors(report);
        expect(GanttController.addFactor.calls.count()).toEqual(1);
        expect(GanttController.setOccurrenceEventId).toHaveBeenCalled();
        var arg = GanttController.addFactor.calls.argsFor(0)[0];
        verifyRoot(arg);
    });

    it('Renders nodes of the factor graph', () => {
        Array.prototype.push.apply(report.factorGraph.nodes, Generator.generateFactorGraphNodes());
        FactorRenderer.renderFactors(report);
        expect(GanttController.addFactor.calls.count()).toEqual(report.factorGraph.nodes.length);
        verifyAddedNodes();
    });

    function verifyAddedNodes() {
        var occurrence = report.occurrence;
        verifyRoot(GanttController.addFactor.calls.argsFor(0)[0]);
        for (var i = 1, len = report.factorGraph.nodes.length; i < len; i++) {
            var node = report.factorGraph.nodes[i];
            var added = GanttController.addFactor.calls.argsFor(i)[0];
            expect(added.statement).toEqual(node);
            expect(added.start_date.getTime()).toEqual(node.startTime);
            expect(added.end_date.getTime()).toEqual(node.endTime);
        }
    }

    it('Renders factor graph part-of hierarchy', () => {
        Array.prototype.push.apply(report.factorGraph.nodes, Generator.generateFactorGraphNodes());
        report.factorGraph.edges = Generator.generatePartOfLinksForNodes(report, report.factorGraph.nodes);
        FactorRenderer.renderFactors(report);
        verifyPartOfHierarchy();
    });

    function verifyPartOfHierarchy() {
        var edges = report.factorGraph.edges;
        for (var i = 0, len = edges.length; i < len; i++) {
            if (edges[i].linkType !== Vocabulary.HAS_PART) {
                continue;
            }
            expect(GanttController.addFactor).toHaveBeenCalledWith(jasmine.any(Object), edges[i].from);
        }
    }

    it('Renders factor graph with causality/mitigation edges', () => {
        Array.prototype.push.apply(report.factorGraph.nodes, Generator.generateFactorGraphNodes());
        report.factorGraph.edges = Generator.generateFactorLinksForNodes(report.factorGraph.nodes);
        FactorRenderer.renderFactors(report);
        verifyAddedLinks();
    });

    function verifyAddedLinks() {
        var edges = report.factorGraph.edges,
            counter = 0;
        for (var i = 0, len = edges.length; i < len; i++) {
            if (edges[i].linkType === Vocabulary.HAS_PART) {
                continue;
            }
            var added = GanttController.addLink.calls.argsFor(counter++)[0];
            expect(added.source).toEqual(edges[i].from);
            expect(added.target).toEqual(edges[i].to);
        }
    }

    it('Renders factor graph with part-of and factor links', () => {
        Array.prototype.push.apply(report.factorGraph.nodes, Generator.generateFactorGraphNodes());
        report.factorGraph.edges = [];
        Array.prototype.push.apply(report.factorGraph.edges, Generator.generatePartOfLinksForNodes(report, report.factorGraph.nodes));
        Array.prototype.push.apply(report.factorGraph.edges, Generator.generateFactorLinksForNodes(report.factorGraph.nodes));
        FactorRenderer.renderFactors(report);
        verifyAddedNodes();
        verifyPartOfHierarchy();
        verifyAddedLinks();
    });


    it('Stores highest reference id', function () {
        Array.prototype.push.apply(report.factorGraph.nodes, Generator.generateFactorGraphNodes());
        FactorRenderer.renderFactors(report);
        var highest = 0;
        for (var i = 0, len = report.factorGraph.nodes.length; i < len; i++) {
            if (highest < report.factorGraph.nodes[i].referenceId) {
                highest = report.factorGraph.nodes[i].referenceId;
            }
        }

        expect(FactorRenderer.greatestReferenceId).toEqual(highest);
    });
});
