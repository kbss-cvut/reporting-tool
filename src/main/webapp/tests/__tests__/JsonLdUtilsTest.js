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
