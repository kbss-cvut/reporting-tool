'use strict';

var TypeaheadStore = require('../stores/TypeaheadStore');

module.exports = {

    /**
     * Gets event type (occurrence category) instance with the specified id.
     * @param id Event type id
     * @param items Event types
     * @return {*} Matching instance or null
     */
    resolveEventType: function (id, items) {
        if (!id) {
            return null;
        }
        if (!items) {
            items = TypeaheadStore.getEventTypes();
        }
        return items.find((item) => {
            return item['@id'] === id;
        });
    }
};
