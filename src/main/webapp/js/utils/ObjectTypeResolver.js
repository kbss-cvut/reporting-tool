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
