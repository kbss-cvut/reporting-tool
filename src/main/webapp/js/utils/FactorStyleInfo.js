'use strict';

var OptionsStore = require('../stores/OptionsStore');
var Utils = require('../utils/Utils');

/**
 * Provides information about factor styles based on their type, e.g. event type, descriptive factor.
 */
var FactorStyleInfo = {

    getStyleInfo: function (type) {
        switch (type) {
            case 'http://onto.fel.cvut.cz/ontologies/eccairs/event-type':
                return {
                    value: 'ET',
                    bsStyle: 'default',
                    ganttCls: 'factor-event-type',
                    title: 'Event type'
                };
            case 'http://onto.fel.cvut.cz/ontologies/eccairs/descriptive-factor':
                return {
                    value: 'DF',
                    bsStyle: 'success',
                    ganttCls: 'factor-descriptive-factor',
                    title: 'Descriptive factor'
                };
            default:
                return {
                    ganttCls: 'factor-event-type'
                };
        }
    },

    getLinkClass: function (link) {
        if (!link.factorType) {
            return '';
        }
        var factorTypes = OptionsStore.getOptions('factorType');
        for (var i = 0, len = factorTypes.length; i < len; i++) {
            if (link.factorType === factorTypes[i]['@id']) {
                return 'gantt-link-' + Utils.getLastPathFragment(factorTypes[i]['@id']);
            }
        }
        return '';
    }
};

module.exports = FactorStyleInfo;
