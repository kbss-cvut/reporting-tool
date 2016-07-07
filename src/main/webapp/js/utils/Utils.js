'use strict';

var Vocabulary = require('../constants/Vocabulary');

/**
 * Common propositions that should not be capitalized
 */
var PREPOSITIONS = [
    'a', 'about', 'across', 'after', 'along', 'among', 'an', 'around', 'as', 'aside', 'at', 'before', 'behind', 'below',
    'beneath', 'beside', 'besides', 'between', 'beyond', 'but', 'by', 'for', 'given', 'in', 'inside', 'into', 'like', 'near',
    'of', 'off', 'on', 'onto', 'outside', 'over', 'since', 'than', 'through', 'to', 'until', 'up', 'via', 'with', 'within',
    'without', 'not'
];

var URL_CONTAINS_QUERY = /^.+\?.+=.+$/;

module.exports = {
    /**
     * Formats the specified date into DD-MM-YY HH:mm
     * @param date The date to format
     */
    formatDate: function (date) {
        var day = date.getDate() < 10 ? '0' + date.getDate() : date.getDate().toString();
        var month = date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : (date.getMonth() + 1).toString();
        var year = (date.getFullYear() % 100).toString();
        var h = date.getHours();
        var hour = h < 10 ? '0' + h : h.toString();
        var minute = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes().toString();
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
        var words = constant.split('_');
        for (var i = 0, len = words.length; i < len; i++) {
            var word = words[i];
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
        var location = response.headers['location'];
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
        var hash = window.location.hash;
        var result = /#[/]?([a-z/0-9]+)\?/.exec(hash);
        return result ? result[1] : '';
    },

    /**
     * Generates a random integer value between 0 and 2^30 (approx. max Java integer / 2).
     *
     * The reason the number is Java max integer / 2 is to accommodate possible increments of the result.
     * @return {number}
     */
    randomInt: function () {
        var min = 0,
            max = 1073741824;   // Max Java Integer / 2
        return Math.floor(Math.random() * (max - min)) + min;
    },

    /**
     * Transforms JSON-LD (framed) based options list into a list of options suitable for the Typeahead component.
     * @param options The options to process
     */
    processTypeaheadOptions: function (options) {
        if (!options) {
            return [];
        }
        return options.map(function (item) {
            return this.jsonLdToTypeaheadOption(item);
        }.bind(this));
    },

    /**
     * Gets the specified JSON-LD object as a simple, more programmatic-friendly object suitable e.g. for typeahead
     * components.
     *
     * The transformation is as follows:
     * <ul>
     *     <li>'@id' -> id</li>
     *     <li>'@type' -> type</li>
     *     <li>rdfs:label -> name</li>
     *     <li>rdfs:comment -> description</li>
     * </ul>
     * @param jsonLd
     */
    jsonLdToTypeaheadOption: function (jsonLd) {
        if (!jsonLd) {
            return null;
        }
        var res = {
            id: jsonLd['@id'],
            type: jsonLd['@type'],
            name: this.getJsonAttValue(jsonLd, Vocabulary.RDFS_LABEL)
        };
        if (jsonLd[Vocabulary.RDFS_COMMENT]) {
            res.description = this.getJsonAttValue(jsonLd, Vocabulary.RDFS_COMMENT);
        }
        return res;
    },

    /**
     * Gets value of the specified attribute.
     *
     * If the attribute value is a string, it is returned, otherwise a '@value' attribute is retrieved from the nested
     * object.
     * @param obj Object from which the attribute value will be extracted
     * @param att Attribute name
     * @param by (optional) JSON attribute to use instead of '@value' in case the att value is an object
     * @return {*} Attribute value (possibly null)
     */
    getJsonAttValue: function (obj, att, by) {
        return obj[att] != null ? (typeof(obj[att]) !== 'object' ? obj[att] : obj[att][by ? by : '@value']) : null;
    },

    /**
     * Transforms the specified JSON-LD input to a list of objects suitable as options for a Select component.
     *
     * This means, that the resulting list consists of objects with value, label and title attributes.
     * @param jsonLd The JSON-LD to process
     * @return {*} List of options
     */
    processSelectOptions: function (jsonLd) {
        return jsonLd.map(function (item) {
            return {
                value: item['@id'],
                label: this.getJsonAttValue(item, Vocabulary.RDFS_LABEL),
                title: this.getJsonAttValue(item, Vocabulary.RDFS_COMMENT)
            }
        }.bind(this));
    },

    /**
     * Checks whether the specified JSON-LD object has the specified property value.
     *
     * The property can either have single value, or it can be an array (in which case the value is searched for in the
     * array).
     * @param object The object to test
     * @param property The property to test
     * @param value The value to look for
     * @return {*|boolean}
     */
    hasValue: function (object, property, value) {
        return object[property] && (object[property] === value || object[property].indexOf(value) !== -1);
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
        for (var i = 0, len = items.length; i < len; i++) {
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
        var hash = 0,
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
    addParametersToUrl(url, parameters) {
        if (parameters) {
            url += URL_CONTAINS_QUERY.test(url) ? '&' : '?';
            Object.getOwnPropertyNames(parameters).forEach(function (param) {
                url += param + '=' + parameters[param] + '&';   // '&' at the end of request URI should not be a problem
            });
        }
        return url;
    }
};
