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

describe('JSON-LD Utils', () => {

    var JsonLdUtils = require('../../js/utils/JsonLdUtils').default,
        data = [
            {
                "@language": "en",
                "@value": "Not processed"
            },
            {
                "@language": "cz",
                "@value": "Nezpracováno"
            }
        ],
        intl;
    
    beforeEach(() => {
        intl = {
            defaultLocale: 'en'
        }
    });

    it('extracts localized version of label', () => {
        intl.locale = 'cz';
        
        var result = JsonLdUtils.getLocalized(data, intl);
        expect(result).toEqual(data[1]['@value']);
    });
    
    it('falls back to default locale when data does not support current locale', () => {
        intl.locale = 'sp';

        var result = JsonLdUtils.getLocalized(data, intl);
        expect(result).toEqual(data[0]['@value']);
    });
    
    it('returns null for null/undefined data passed in', () => {
        expect(JsonLdUtils.getLocalized(null, intl)).toBeNull();
        expect(JsonLdUtils.getLocalized(undefined, intl)).toBeNull();
    });
});
