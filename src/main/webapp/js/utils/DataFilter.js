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

/**
 * Filters data according to specified filter(s).
 *
 * The filtering supports property paths - separated by dots, i.e. 'att.innerAtt' will filter the items by 'innerAtt'
 * of attribute 'att' of each item.
 * Filter value 'all' means to skip the given filter.
 */
var DataFilter = {

    filterData: function (data, filter) {
        if (this._canSkipFilter(filter)) {
            return data;
        }
        return data.filter(function (item) {
            for (var key in filter) {
                if (filter[key] === 'all') {
                    continue;
                }
                var path = key.split('.');
                var value = item;
                for (var i = 0, len = path.length; i < len; i++) {
                    value = value[path[i]];
                }
                if ((Array.isArray(value) && value.indexOf(filter[key]) === -1) || (!Array.isArray(value) && value !== filter[key])) {
                    return false;
                }
            }
            return true;
        });
    },

    _canSkipFilter: function (filter) {
        if (!filter) {
            return true;
        }
        for (var key in filter) {
            if (filter[key] !== 'all') {
                return false;
            }
        }
        return true;
    }
};

module.exports = DataFilter;
