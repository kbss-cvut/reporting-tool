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

var Constants = require('../constants/Constants');
var Utils = require('../utils/Utils');

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
                var i, len;
                if (!filter.hasOwnProperty(key) || filter[key] === Constants.FILTER_DEFAULT) {
                    continue;
                }
                var value = Utils.getPropertyValue(item, key);
                if (!value) {
                    return false;
                }
                var filterValue = filter[key],
                    result = false;
                if (!Array.isArray(filterValue)) {
                    result = (Array.isArray(value) && value.indexOf(filterValue) !== -1) || (!Array.isArray(value) && value === filterValue);

                } else {
                    // If the filter itself is an array it suffices when a single value from the filter is present
                    for (i = 0, len = filterValue.length; i < len; i++) {
                        if (value === filterValue[i] || Array.isArray(value) && value.indexOf(filterValue[i]) !== -1) {
                            result = true;
                            break;
                        }
                    }
                }
                if (!result) {
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
            if (filter[key] !== Constants.FILTER_DEFAULT) {
                return false;
            }
        }
        return true;
    }
};

module.exports = DataFilter;
