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
