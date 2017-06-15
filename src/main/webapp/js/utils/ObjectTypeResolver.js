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

module.exports = {

    /**
     * Resolves type of the specified object.
     *
     * More precisely it returns an option whose identifier corresponds to the object's type.
     * @param object Object with types field or type URI as string
     * @param options The options to search for type
     * @return {*} Matching type or null
     */
    resolveType: function (object, options) {
        if (!object || !options) {
            return null;
        }
        var types = typeof object === 'object' ? (Array.isArray(object) ? object : object.types) : [object],
            tLen = types.length, j;
        for (var i = 0, len = options.length; i < len; i++) {
            var option = options[i];
            for (j = 0; j < tLen; j++) {
                if (types.indexOf(option['@id']) !== -1) {
                    return option;
                }
            }
        }
        return null;
    }
};
