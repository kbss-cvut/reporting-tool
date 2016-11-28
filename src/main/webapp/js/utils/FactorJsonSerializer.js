'use strict';

var assign = require('object-assign');
var Vocabulary = require('../constants/Vocabulary');

/**
 * Main facade of factor graph serialization to JSON.
 */
var FactorJsonSerializer = {
    ganttController: null,
    ganttIdsToNodes: null,

    setGanttController: function (controller) {
        this.ganttController = controller;
        FactorSerializer.setGanttController(controller);
    },

    getFactorGraph: function () {
        this._verifyGanttControllerIsSet();
        return FactorSerializer.getFactorGraph();
    },

    _verifyGanttControllerIsSet: function () {
        if (!this.ganttController) {
            throw 'Missing Gantt controller!';
        }
    }
};

/**
 * This class does the actual serialization.
 */
var FactorSerializer = {
    ganttController: null,
    ganttIdsToNodes: null,

    setGanttController: function (controller) {
        this.ganttController = controller;
    },

    getFactorGraph: function () {
        this.ganttIdsToNodes = {};
        // Make sure nodes are processed before edges
        var nodes = this._getNodes();
        return {
            nodes: nodes,
            edges: this._getEdges()
        };
    },

    _getNodes: function () {
        var nodes = [],
            me = this;
        this.ganttController.forEach((item) => {
            var node = assign({}, item.statement);
            node.startTime = item.start_date.getTime();
            node.endTime = item.end_date.getTime();
            me.ganttIdsToNodes[item.id] = node;
            nodes.push(node);
        });
        return nodes;
    },

    _getEdges: function () {
        var edges = [];
        Array.prototype.push.apply(edges, this._resolvePartOfHierarchy());
        Array.prototype.push.apply(edges, this._resolveFactorLinks());
        return edges;
    },

    _resolvePartOfHierarchy: function () {
        var partOfEdges = [];
        this.ganttController.forEach((item) => {
            var children = this.ganttController.getChildren(item.id);
            if (children.length === 0) {
                return;
            }
            for (var i = 0, len = children.length; i < len; i++) {
                partOfEdges.push({
                    from: this.ganttIdsToNodes[item.id],
                    to: this.ganttIdsToNodes[children[i].id],
                    linkType: Vocabulary.HAS_PART
                });
            }
        });
        return partOfEdges;
    },

    _resolveFactorLinks: function () {
        var links = this.ganttController.getLinks(),
            edges = [];
        for (var i = 0, len = links.length; i < len; i++) {
            edges.push({
                from: this.ganttIdsToNodes[links[i].source],
                to: this.ganttIdsToNodes[links[i].target],
                linkType: links[i].factorType
            });
        }
        return edges;
    }
};

module.exports = FactorJsonSerializer;
