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
