'use strict';

var OptionsStore = require('../stores/OptionsStore');

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
            items = OptionsStore.getOptions('eventType');
        }
        return items.find((item) => {
            return item['@id'] === id;
        });
    }
};
