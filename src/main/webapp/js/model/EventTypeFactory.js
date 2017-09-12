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
