'use strict';

describe('Test factor tree hierarchy serialization for JSON', function () {

    const Generator = require('../environment/Generator').default;
    let GanttController,
        FactorJsonSerializer,
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
        const nodes = Generator.generateFactorGraphNodes();
        initForEachStub(nodes);
        GanttController.getChildren.and.returnValue([]);
        const factorGraph = FactorJsonSerializer.getFactorGraph(report);
        expect(factorGraph.nodes).not.toBeNull();
        expect(factorGraph.nodes).toEqual(nodes);
    });

    function initForEachStub(nodes) {
        GanttController.forEach.and.callFake((func) => {
            for (let i = 0, len = nodes.length; i < len; i++) {
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
        const nodes = [report.occurrence];
        Array.prototype.push.apply(nodes, Generator.generateFactorGraphNodes());
        const partOfLinks = Generator.generatePartOfLinksForNodes(report.occurrence, nodes);
        initGetFactorStub(nodes);
        initForEachStub(nodes);
        initGetChildrenStub(nodes, partOfLinks);

        const factorGraph = FactorJsonSerializer.getFactorGraph(report);
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
            const childLinks = partOfLinks.filter((lnk) => {
                return lnk.from.referenceId === id;
            });
            const childIds = childLinks.map((item) => {
                return item.to.referenceId;
            });
            const children = [];
            for (let i = 0, len = nodes.length; i < len; i++) {
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
        for (let i = 0, len = expected.length; i < len; i++) {
            const index = i,
                edge = actual.find((item) => {
                    return item.from.uri === expected[index].from.uri && item.to.uri === expected[index].to.uri && item.linkType === expected[index].linkType;
                });
            expect(edge).toBeDefined();
            expect(edge).not.toBeNull();
        }
    }

    it('Serializes causality/mitigation relations', () => {
        const nodes = [report.occurrence];
        Array.prototype.push.apply(nodes, Generator.generateFactorGraphNodes());
        const factorLinks = Generator.generateFactorLinksForNodes(nodes);
        initGetLinksStub(factorLinks);
        initGetFactorStub(nodes);
        initForEachStub(nodes);
        initGetChildrenStub(nodes, []);
        const factorGraph = FactorJsonSerializer.getFactorGraph(report);
        expect(factorGraph.nodes).not.toBeNull();
        expect(factorGraph.edges).not.toBeNull();
        expect(factorGraph.edges.length).toEqual(factorLinks.length);
        verifyLinks(factorLinks, factorGraph.edges);
    });

    function initGetLinksStub(factorLinks) {
        GanttController.getLinks.and.callFake(() => {
            return factorLinks.map((item) => {
                return {
                    source: item.from.referenceId,
                    target: item.to.referenceId,
                    factorType: item.linkType,
                    uri: item.uri
                };
            });
        });
    }

    it('Serializes factor graph', () => {
        const nodes = [report.occurrence];
        let expected;
        Array.prototype.push.apply(nodes, Generator.generateFactorGraphNodes());
        const factorLinks = Generator.generateFactorLinksForNodes(nodes),
            partOfLinks = Generator.generatePartOfLinksForNodes(report.occurrence, nodes);
        initGetLinksStub(factorLinks);
        initGetFactorStub(nodes);
        initForEachStub(nodes);
        initGetChildrenStub(nodes, partOfLinks);
        expected = nodes.slice();

        const factorGraph = FactorJsonSerializer.getFactorGraph(report);
        expect(factorGraph.nodes).not.toBeNull();
        expect(factorGraph.nodes).toEqual(expected);
        expect(factorGraph.edges).not.toBeNull();
        expect(factorGraph.edges.length).toEqual(partOfLinks.length + factorLinks.length);
        verifyLinks(partOfLinks.concat(factorLinks), factorGraph.edges);
    });

    it('sets edge URI based on URI attached to link in graph', () => {
        const nodes = [report.occurrence];
        Array.prototype.push.apply(nodes, Generator.generateFactorGraphNodes());
        const factorLinks = Generator.generateFactorLinksForNodes(nodes);
        factorLinks.forEach(fl => fl.uri = Generator.getRandomUri());
        initForEachStub(nodes);
        initGetLinksStub(factorLinks);
        initGetFactorStub(nodes);
        initGetChildrenStub(nodes, []);
        const factorGraph = FactorJsonSerializer.getFactorGraph(report);
        expect(factorGraph.edges.length).toEqual(factorLinks.length);
        for (let i = 0, len = factorLinks.length; i < len; i++) {
            const edge = factorGraph.edges[i];
            expect(edge.uri).toBeDefined();
            expect(edge.uri).toEqual(factorLinks[i].uri);
        }
    });
});
