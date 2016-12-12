'use strict';

const Constants = require('../constants/Constants');

/**
 * Common propositions that should not be capitalized
 */
const PREPOSITIONS = [
    'a', 'about', 'across', 'after', 'along', 'among', 'an', 'around', 'as', 'aside', 'at', 'before', 'behind', 'below',
    'beneath', 'beside', 'besides', 'between', 'beyond', 'but', 'by', 'for', 'given', 'in', 'inside', 'into', 'like', 'near',
    'of', 'off', 'on', 'onto', 'outside', 'over', 'since', 'than', 'through', 'to', 'until', 'up', 'via', 'with', 'within',
    'without', 'not'
];

const URL_CONTAINS_QUERY = /^.+\?.+=.+$/;

module.exports = {
    /**
     * Formats the specified date into DD-MM-YY HH:mm
     * @param date The date to format
     */
    formatDate: function (date = null) {
        if (date === null) {
            return '';
        }
        if (!(date instanceof Date)) {
            date = new Date(date);
        }
        const day = date.getDate() < 10 ? '0' + date.getDate() : date.getDate().toString(),
            month = date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : (date.getMonth() + 1).toString(),
            year = (date.getFullYear() % 100).toString(),
            h = date.getHours(),
            hour = h < 10 ? '0' + h : h.toString(),
            minute = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes().toString();
        return (day + '-' + month + '-' + year + ' ' + hour + ':' + minute);
    },

    /**
     * Returns a Java constant (uppercase with underscores) as a nicer string.
     *
     * Replaces underscores with spaces. And if capitalize is selected, capitalizes the words.
     */
    constantToString: function (constant, capitalize) {
        if (!capitalize) {
            return constant.replace(/_/g, ' ');
        }
        const words = constant.split('_');
        for (let i = 0, len = words.length; i < len; i++) {
            let word = words[i];
            if (i > 0 && PREPOSITIONS.indexOf(word.toLowerCase()) !== -1) {
                words[i] = word.toLowerCase();
            } else {
                words[i] = word.charAt(0) + word.substring(1).toLowerCase();
            }
        }
        return words.join(' ');
    },

    /**
     * Converts the specified time value from one time unit to the other.
     *
     * Currently supported units are seconds, minutes and hours. When converting to larger units (e.g. from seconds to
     * minutes), the result is rounded to integer.
     *
     * @param fromUnit Unit to convert from
     * @param toUnit Target unit
     * @param value The value to convert
     * @return {*} Converted value
     */
    convertTime: function (fromUnit, toUnit, value) {
        if (fromUnit === toUnit) {
            return value;
        }
        switch (fromUnit) {
            case 'second':
                if (toUnit === 'minute') {
                    return Math.round(value / 60);
                } else {
                    return Math.round(value / 60 / 60);
                }
            case 'minute':
                if (toUnit === 'second') {
                    return 60 * value;
                } else {
                    return Math.round(value / 60);
                }
            case 'hour':
                if (toUnit === 'second') {
                    return 60 * 60 * value;
                } else {
                    return 60 * value;
                }
            default:
                return value;
        }
    },

    /**
     * Extracts report key from location header in the specified Ajax response.
     * @param response Ajax response
     * @return {string} Report key as string
     */
    extractKeyFromLocationHeader: function (response) {
        const location = response.headers['location'];
        if (!location) {
            return '';
        }
        return location.substring(location.lastIndexOf('/') + 1);
    },

    /**
     * Extracts application path from the current window location.
     *
     * I.e. if the current hash is '#/reports?_k=312312', the result will be 'reports'
     * @return {String}
     */
    getPathFromLocation: function () {
        const hash = window.location.hash,
            hashPart = hash.match(/#(?:\/?)/)[0],
            endIndex = hash.search(/(\?|&)_k=/);
        return hash.substring(hashPart.length, endIndex !== -1 ? endIndex : hash.length);
    },

    /**
     * Generates a random integer value between 0 and 2^30 (approx. max Java integer / 2).
     *
     * The reason the number is Java max integer / 2 is to accommodate possible increments of the result.
     * @return {number}
     */
    randomInt: function () {
        const min = 0,
            max = 1073741824;   // Max Java Integer / 2
        return Math.floor(Math.random() * (max - min)) + min;
    },

    /**
     * Maps the specified id to a name based on a matching item.
     *
     * This function assumes that the items have been processed by {@link #jsonLdToTypeaheadOption), so the id should
     * be equal to one of the item's 'id' attribute, and if it is, the item's 'name' is returned.
     * @param items The items containing also mapping for the specified value (presumably)
     * @param id The id to map, probably a URI
     * @return {*}
     */
    idToName: function (items, id) {
        if (!items) {
            return id;
        }
        for (let i = 0, len = items.length; i < len; i++) {
            if (items[i].id === id) {
                return items[i].name;
            }
        }
        return id;
    },

    /**
     * Gets the last path fragment from the specified URL.
     *
     * I.e. it returns the portion after the last '/'
     * @param url
     * @return {string|*}
     */
    getLastPathFragment: function (url) {
        return url.substring(url.lastIndexOf('/') + 1);
    },

    /**
     * Calculates a simple hash of the specified string, much like usual Java implementations.
     * @param str The string to compute has for
     * @return {number}
     */
    getStringHash: function (str) {
        let hash = 0,
            strlen = str ? str.length : 0,
            i,
            c;
        if (strlen === 0) {
            return hash;
        }
        for (i = 0; i < strlen; i++) {
            c = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + c;
            hash = hash & hash; // Convert to 32bit integer
        }
        return hash;
    },

    /**
     * Appends parameters in the specified argument as query parameters to the specified url.
     *
     * The url can already contain a query string
     * @param url The URL to append parameters to
     * @param parameters The parameters to add
     * @return {*} Updated URL
     */
    addParametersToUrl: function (url, parameters) {
        if (parameters) {
            url += URL_CONTAINS_QUERY.test(url) ? '&' : '?';
            Object.getOwnPropertyNames(parameters).forEach(function (param) {
                url += param + '=' + parameters[param] + '&';   // '&' at the end of request URI should not be a problem
            });
        }
        return url;
    },

    /**
     * Determines suitable time scale for graphical representation of events.
     *
     * It is assumed that the root event's time span exceeds time span of all its descendants.
     *
     * If the {@code rootEvent} has no {@code startTime} and {@code endTime}, 'relative' scale is returned.
     * @param rootEvent
     */
    determineTimeScale: function (rootEvent) {
        if (rootEvent.startTime === null || rootEvent.startTime === undefined || rootEvent.endTime === null || rootEvent.endTime === undefined) {
            return Constants.TIME_SCALES.RELATIVE;
        }
        let duration = (rootEvent.endTime - rootEvent.startTime) / 1000;    // to seconds
        if (duration < Constants.TIME_SCALE_THRESHOLD) {
            return Constants.TIME_SCALES.SECOND;
        }
        duration = duration / 60;
        if (duration < Constants.TIME_SCALE_THRESHOLD) {
            return Constants.TIME_SCALES.MINUTE;
        }
        return Constants.TIME_SCALES.HOUR;
    },

    /**
     * Resolves value of the specified property path.
     *
     * I.e. the path can contain dots and this method will traverse the object graph (starting in the object) and try
     * to get value specified by the path. If any part of the property path is missing in the object graph, null is
     * returned.
     * @param object The object to read value from (root of object graph)
     * @param propertyPath Path to the property, use '.' for object traversal
     */
    getPropertyValue: function (object, propertyPath) {
        let path = propertyPath.split('.'),
            value = object;
        for (let i = 0, len = path.length; i < len; i++) {
            value = value[path[i]];
            if (!value && i < len) {
                return null;
            }
        }
        return value;
    },

    /**
     * Calculates hash code of the specified string, similarly to the Java implementation.
     * @param str The string to calculate hash for
     * @return {number} Hash
     */
    stringHashCode: function (str) {
        let hash = 0,
            len = str.length,
            i, c;
        if (len === 0) {
            return hash;
        }
        for (i = 0; i < len; i++) {
            c = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + c;
            hash &= hash;
        }
        return hash;
    }
};
