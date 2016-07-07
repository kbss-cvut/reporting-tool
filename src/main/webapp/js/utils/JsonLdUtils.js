'use strict';

export default class JsonLdUtils {

    static getLocalized(data, intl) {
        var locale = intl.locale,
            defaultLocale = intl.defaultLocale,
            defaultValue,
            i, len;
        if (!data) {
            return null;
        }
        if (typeof data !== 'object' && !Array.isArray(data)) {
            return data;
        }
        if (!Array.isArray(data)) {
            return data['@value'];
        }
        for (i = 0, len = data.length; i < len; i++) {
            if (data[i]['@language']) {
                if (data[i]['@language'] === locale) {
                    return data[i]['@value'];
                } else if (data[i]['@language'] === defaultLocale) {
                    defaultValue = data[i]['@value'];
                }
            }
        }
        return defaultValue;
    }
}
