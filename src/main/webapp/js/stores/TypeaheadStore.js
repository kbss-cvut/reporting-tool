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

var Reflux = require('reflux');
var jsonld = require('jsonld');

var Actions = require('../actions/Actions');
var Ajax = require('../utils/Ajax');

var URL = 'rest/options?type=';

var eventTypes = [];
var occurrenceCategories = [];
var locations = [];
var operators = [];

var TypeaheadStore = Reflux.createStore({

    init: function () {
        this.listenTo(Actions.loadEventTypes, this.onLoadEventTypes);
        this.listenTo(Actions.loadLocations, this.onLoadLocations);
        this.listenTo(Actions.loadOperators, this.onLoadOperators);
        this.listenTo(Actions.loadOccurrenceCategories, this.onLoadOccurrenceCategories);
    },

    onLoadEventTypes: function () {
        var self = this;
        this.load(Actions.loadEventTypes, 'eventType', 'event types', eventTypes, function (data) {
            if (data.length === 0) {
                self.trigger({
                    action: Actions.loadEventTypes,
                    data: eventTypes
                });
                return;
            }
            jsonld.frame(data, {}, null, function (err, framed) {
                eventTypes = framed['@graph'];
                self.trigger({
                    action: Actions.loadEventTypes,
                    data: eventTypes
                });
            });
        });
    },

    load: function (action, type, resourceName, requiredData, success) {
        if (requiredData.length !== 0) {
            this.trigger({
                action: action,
                data: requiredData
            });
            return;
        }
        Ajax.get(URL + type).end(function (data) {
            success(data);
        }.bind(this), function () {
            this.trigger();
        }.bind(this));
    },

    getEventTypes: function () {
        return eventTypes;
    },

    onLoadLocations: function () {
        this.load(Actions.loadLocations, 'location', 'locations', locations, function (data) {
            locations = data;
            this.trigger();
        }.bind(this));
    },

    getLocations: function () {
        return locations;
    },

    onLoadOperators: function () {
        this.load(Actions.loadOperators, 'operator', 'operators', operators, function (data) {
            operators = data;
            this.trigger();
        }.bind(this));
    },

    getOperators: function () {
        return operators;
    },

    onLoadOccurrenceCategories: function () {
        var self = this;
        this.load(Actions.loadOccurrenceCategories, 'occurrenceCategory', 'occurrenceCategories', occurrenceCategories, function (data) {
            if (data.length === 0) {
                self.trigger({
                    action: Actions.loadOccurrenceCategories,
                    data: occurrenceCategories
                });
                return;
            }
            jsonld.frame(data, {}, null, function (err, framed) {
                occurrenceCategories = framed['@graph'];
                self.trigger({
                    action: Actions.loadOccurrenceCategories,
                    data: occurrenceCategories
                });
            });
        });
    },

    getOccurrenceCategories: function () {
        return occurrenceCategories;
    }
});

module.exports = TypeaheadStore;
