'use strict';

describe('Test factor tree hierarchy serialization for JSON', function () {

    var GanttController,
        FactorJsonSerializer,
        Generator = require('../environment/Generator').default,
        report;

    beforeEach(function () {
        GanttController = jasmine.createSpyObj('ganttController', ['forEach', 'getFactor', 'getChildren', 'getLinks']);
        FactorJsonSerializer = require('../../js/utils/FactorJsonSerializer');
        FactorJsonSerializer.setGanttController(GanttController);
        GanttController.getLinks.and.returnValue([]);
        report = Generator.generateOccurrenceReport();
        report.occurrence.referenceId = 117;
    });

    it('Serializes nodes from the Gantt component', () => {
        var nodes = Generator.generateFactorGraphNodes();
        initForEachStub(nodes);
        GanttController.getChildren.and.returnValue([]);
        var factorGraph = FactorJsonSerializer.getFactorGraph(report);
        expect(factorGraph.nodes).not.toBeNull();
        expect(factorGraph.nodes).toEqual(nodes);
    });

    function initForEachStub(nodes) {
        GanttController.forEach.and.callFake((func) => {
            for (var i = 0, len = nodes.length; i < len; i++) {
                func({
                    id: nodes[i].referenceId,   // Just for the sake of test simplicity
                    start_date: new Date(nodes[i].startTime),
                    end_date: new Date(nodes[i].endTime),
                    statement: nodes[i]
                });
            }
        });
    }

    it('Serializes part-of hierarchy', () => {
        var nodes = [report.occurrence];
        Array.prototype.push.apply(nodes, Generator.generateFactorGraphNodes());
        var partOfLinks = Generator.generatePartOfLinksForNodes(report.occurrence, nodes);
        initGetFactorStub(nodes);
        initForEachStub(nodes);
        initGetChildrenStub(nodes, partOfLinks);

        var factorGraph = FactorJsonSerializer.getFactorGraph(report);
        expect(factorGraph.nodes).not.toBeNull();
        expect(factorGraph.edges).not.toBeNull();
        expect(factorGraph.edges.length).toEqual(partOfLinks.length);
        verifyLinks(partOfLinks, factorGraph.edges);
    });

    function initGetFactorStub(nodes) {
        GanttController.getFactor.and.callFake((id) => {
            return nodes.find((item) => {
                return item.referenceId === id;
            });
        });
    }

    function initGetChildrenStub(nodes, partOfLinks) {
        GanttController.getChildren.and.callFake((id) => {
            var childLinks = partOfLinks.filter((lnk) => {
                return lnk.from.referenceId === id;
            });
            var childIds = childLinks.map((item) => {
                return item.to.referenceId;
            });
            var children = [];
            for (var i = 0, len = nodes.length; i < len; i++) {
                if (childIds.indexOf(nodes[i].referenceId) !== -1) {
                    children.push({
                        id: nodes[i].referenceId,   // Just for the sake of test simplicity
                        start_date: new Date(nodes[i].startTime),
                        end_date: new Date(nodes[i].endTime),
                        statement: nodes[i],
                        parent: id
                    });
                }
            }
            return children;
        });
    }

    function verifyLinks(expected, actual) {
        for (var i = 0, len = expected.length; i < len; i++) {
            const index = i;
            expect(actual.find((item) => {
                return item.from === expected[index].from && item.to === expected[index].to && item.linkType === expected[index].linkType;
            })).not.toBeNull();
        }
    }

    it('Serializes causality/mitigation relations', () => {
        var nodes = [report.occurrence];
        Array.prototype.push.apply(nodes, Generator.generateFactorGraphNodes());
        var factorLinks = Generator.generateFactorLinksForNodes(nodes);
        initGetLinksStub(factorLinks);
        initGetFactorStub(nodes);
        initForEachStub(nodes);
        initGetChildrenStub(nodes, []);
        var factorGraph = FactorJsonSerializer.getFactorGraph(report);
        expect(factorGraph.nodes).not.toBeNull();
        expect(factorGraph.edges).not.toBeNull();
        expect(factorGraph.edges.length).toEqual(factorLinks.length);
        verifyLinks(factorLinks, factorGraph.edges);
    });

    function initGetLinksStub(factorLinks) {
        GanttController.getLinks.and.callFake(() => {
            return factorLinks.map((item) => {
                return {
                    source: item.from,
                    target: item.to,
                    factorType: item.linkType
                };
            });
        });
    }

    it('Serializes factor graph', () => {
        var nodes = [report.occurrence],
            expected;
        Array.prototype.push.apply(nodes, Generator.generateFactorGraphNodes());
        var factorLinks = Generator.generateFactorLinksForNodes(nodes);
        var partOfLinks = Generator.generatePartOfLinksForNodes(report.occurrence, nodes);
        initGetLinksStub(factorLinks);
        initGetFactorStub(nodes);
        initForEachStub(nodes);
        initGetChildrenStub(nodes, partOfLinks);
        expected = nodes.slice();

        var factorGraph = FactorJsonSerializer.getFactorGraph(report);
        expect(factorGraph.nodes).not.toBeNull();
        expect(factorGraph.nodes).toEqual(expected);
        expect(factorGraph.edges).not.toBeNull();
        expect(factorGraph.edges.length).toEqual(partOfLinks.length + factorLinks.length);
        verifyLinks(partOfLinks.concat(factorLinks), factorGraph.edges);
    });
});
