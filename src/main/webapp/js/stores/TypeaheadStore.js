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
