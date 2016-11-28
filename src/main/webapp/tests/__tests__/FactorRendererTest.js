'use strict';

describe('FactorRenderer', function () {

    var rewire = require('rewire'),
        FactorRenderer = rewire('../../js/components/factor/FactorRenderer'),
        Constants = require('../../js/constants/Constants'),
        Vocabulary = require('../../js/constants/Vocabulary'),
        Generator = require('../environment/Generator').default,
        GanttController,
        report;

    beforeEach(function () {
        GanttController = jasmine.createSpyObj('GanttController', ['addFactor', 'addLink', 'setRootEventId', 'setFactorParent', 'applyUpdates', 'setScale']);
        FactorRenderer.__set__('GanttController', GanttController);
        report = {
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

    function initOccurrence() {
        return {
            uri: 'http://krizik.felk.cvut.cz/ontologies/inbas-2015#Occurrence_instance319360066',
            key: '25857640490956897',
            name: 'Runway incursion',
            eventTypes: [Generator.randomCategory().id],
            startTime: 1447144734937,
            endTime: 1447144800937,
            referenceId: 1
        };
    }

    it('Renders occurrence when factor graph is empty', () => {
        report.occurrence = initOccurrence();
        delete report.factorGraph;
        FactorRenderer.renderFactors(report);
        expect(GanttController.addFactor.calls.count()).toEqual(1);
        expect(GanttController.setRootEventId).toHaveBeenCalled();
        var arg = GanttController.addFactor.calls.argsFor(0)[0];
        verifyRoot(arg, 'occurrence');
    });

    function verifyRoot(arg, rootAttribute) {
        expect(arg.text).toEqual(report[rootAttribute].name);
        if (report[rootAttribute].startTime) {
            expect(arg.start_date.getTime()).toEqual(report[rootAttribute].startTime);
            expect(arg.end_date.getTime()).toEqual(report[rootAttribute].endTime);
        }
        expect(arg.readonly).toBeTruthy();
        expect(arg.parent).not.toBeDefined();
    }

    it('Renders occurrence when it is the only node in factor graph', () => {
        report.occurrence = initOccurrence();
        FactorRenderer.renderFactors(report);
        expect(GanttController.addFactor.calls.count()).toEqual(1);
        expect(GanttController.setRootEventId).toHaveBeenCalled();
        var arg = GanttController.addFactor.calls.argsFor(0)[0];
        verifyRoot(arg, 'occurrence');
    });

    it('Renders nodes of the factor graph', () => {
        report.occurrence = initOccurrence();
        Array.prototype.push.apply(report.factorGraph.nodes, Generator.generateFactorGraphNodes());
        FactorRenderer.renderFactors(report);
        expect(GanttController.addFactor.calls.count()).toEqual(report.factorGraph.nodes.length);
        verifyAddedNodes('occurrence');
    });

    function verifyAddedNodes(rootAttribute) {
        verifyRoot(GanttController.addFactor.calls.argsFor(0)[0], rootAttribute);
        for (var i = 1, len = report.factorGraph.nodes.length; i < len; i++) {
            var node = report.factorGraph.nodes[i];
            var added = GanttController.addFactor.calls.argsFor(i)[0];
            expect(added.statement).toEqual(node);
            expect(added.start_date.getTime()).toEqual(node.startTime);
            expect(added.end_date.getTime()).toEqual(node.endTime);
        }
    }

    it('Renders factor graph part-of hierarchy', () => {
        report.occurrence = initOccurrence();
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
            expect(GanttController.addFactor).toHaveBeenCalledWith(jasmine.any(Object), edges[i].from.referenceId);
        }
    }

    it('Renders factor graph with causality/mitigation edges', () => {
        report.occurrence = initOccurrence();
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
            expect(added.source).toEqual(edges[i].from.referenceId);
            expect(added.target).toEqual(edges[i].to.referenceId);
        }
    }

    it('Renders factor graph with part-of and factor links', () => {
        report.occurrence = initOccurrence();
        Array.prototype.push.apply(report.factorGraph.nodes, Generator.generateFactorGraphNodes());
        report.factorGraph.edges = [];
        Array.prototype.push.apply(report.factorGraph.edges, Generator.generatePartOfLinksForNodes(report, report.factorGraph.nodes));
        Array.prototype.push.apply(report.factorGraph.edges, Generator.generateFactorLinksForNodes(report.factorGraph.nodes));
        FactorRenderer.renderFactors(report);
        verifyAddedNodes('occurrence');
        verifyPartOfHierarchy();
        verifyAddedLinks();
    });


    it('Stores highest reference id', function () {
        report.occurrence = initOccurrence();
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
