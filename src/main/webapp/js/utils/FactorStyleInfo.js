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
