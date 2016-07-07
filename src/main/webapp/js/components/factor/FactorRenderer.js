'use strict';

var GanttController = require('./GanttController');
var Vocabulary = require('../../constants/Vocabulary');
var EventTypeFactory = require('../../model/EventTypeFactory');
var Utils = require('../../utils/Utils');

var FactorRenderer = {

    greatestReferenceId: Number.MIN_VALUE,

    renderFactors: function (report, eventTypes) {
        this.greatestReferenceId = Number.MIN_VALUE;
        if (report.occurrence) {
            OccurrenceReportFactorRenderer.renderFactors(report, eventTypes);
        } else {
            FactorRendererImpl.renderFactors(report.factorGraph, eventTypes);
        }
    }
};

/**
 * Renderer for OccurrenceReports.
 *
 * It needs to add the occurrence to the factor graph.
 */
var OccurrenceReportFactorRenderer = {

    renderFactors: function (report, eventTypes) {
        if (!report.occurrence.referenceId) {
            report.occurrence.referenceId = Date.now();
        }
        var factorGraph = report.factorGraph;
        if (factorGraph) {
            var ind = factorGraph.nodes.indexOf(report.occurrence.referenceId);
            if (ind !== -1) {
                factorGraph.nodes[ind] = report.occurrence;
            }
        } else {
            report.factorGraph = {
                nodes: [report.occurrence]
            };
        }
        report.occurrence.readOnly = true;
        GanttController.setOccurrenceEventId(report.occurrence.referenceId);
        FactorRendererImpl.renderFactors(report.factorGraph, eventTypes);
    }
};

/**
 * This does the actual factor graph rendering.
 *
 * Use decorators to do any necessary setup before the rendering.
 */
var FactorRendererImpl = {

    renderFactors: function (factorGraph, eventTypes) {
        if (!factorGraph) {
            return;
        }
        var edges = this._processEdges(factorGraph.edges);
        this._addNodes(factorGraph.nodes, edges.partOfHierarchy, eventTypes);
        this._addLinks(edges.links);
    },

    _processEdges: function (edges) {
        var nodesToParents = {};
        var links = [];
        if (edges) {
            for (var i = 0, len = edges.length; i < len; i++) {
                if (edges[i].linkType === Vocabulary.HAS_PART) {
                    nodesToParents[edges[i].to] = edges[i].from;
                } else {
                    links.push(edges[i]);
                }
            }
        }
        return {
            partOfHierarchy: nodesToParents,
            links: links
        };
    },

    _addNodes: function (nodes, partOfHierarchy, eventTypes) {
        var node;
        for (var i = 0, len = nodes.length; i < len; i++) {
            node = nodes[i];
            var text;
            if (node.name) {
                text = node.name;
            } else {
                var eventType = EventTypeFactory.resolveEventType(node.eventType, eventTypes);
                text = eventType ? Utils.getJsonAttValue(eventType, Vocabulary.RDFS_LABEL) : node.eventType;
            }
            GanttController.addFactor({
                id: node.referenceId,
                text: text,
                start_date: new Date(node.startTime),
                end_date: new Date(node.endTime),
                readonly: node.readOnly,
                statement: node
            }, partOfHierarchy[node.referenceId]);
            if (FactorRenderer.greatestReferenceId < node.referenceId) {
                FactorRenderer.greatestReferenceId = node.referenceId;
            }
        }
    },

    _addLinks: function (links) {
        for (var i = 0, len = links.length; i < len; i++) {
            GanttController.addLink({
                source: links[i].from,
                target: links[i].to,
                factorType: links[i].linkType
            });
        }
    }
};

module.exports = FactorRenderer;
