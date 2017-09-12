/*
 * Copyright (C) 2017 Czech Technical University in Prague
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

const assign = require('object-assign');
const Vocabulary = require('../constants/Vocabulary');

/**
 * Main facade of factor graph serialization to JSON.
 */
const FactorJsonSerializer = {
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
const FactorSerializer = {
    ganttController: null,
    ganttIdsToNodes: null,

    setGanttController: function (controller) {
        this.ganttController = controller;
    },

    getFactorGraph: function () {
        this.ganttIdsToNodes = {};
        // Make sure nodes are processed before edges
        const nodes = this._getNodes();
        return {
            nodes: nodes,
            edges: this._getEdges()
        };
    },

    _getNodes: function () {
        const nodes = [],
            me = this;
        this.ganttController.forEach((item) => {
            const node = assign({}, item.statement);
            node.startTime = item.start_date.getTime();
            node.endTime = item.end_date.getTime();
            me.ganttIdsToNodes[item.id] = node;
            nodes.push(node);
        });
        return nodes;
    },

    _getEdges: function () {
        const edges = [];
        Array.prototype.push.apply(edges, this._resolvePartOfHierarchy());
        Array.prototype.push.apply(edges, this._resolveFactorLinks());
        return edges;
    },

    _resolvePartOfHierarchy: function () {
        const partOfEdges = [];
        this.ganttController.forEach((item) => {
            const children = this.ganttController.getChildren(item.id);
            if (children.length === 0) {
                return;
            }
            for (let i = 0, len = children.length; i < len; i++) {
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
        const links = this.ganttController.getLinks(),
            edges = [];
        for (let i = 0, len = links.length; i < len; i++) {
            edges.push({
                from: this.ganttIdsToNodes[links[i].source],
                to: this.ganttIdsToNodes[links[i].target],
                linkType: links[i].factorType,
                uri: links[i].uri
            });
        }
        return edges;
    }
};

module.exports = FactorJsonSerializer;
