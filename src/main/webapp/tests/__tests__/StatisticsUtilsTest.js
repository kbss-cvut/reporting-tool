'use strict';

describe('Statistics utility functions tests', function () {

    const Utils = require('../../js/components/statistics/Utils'),
        Generator = require('../environment/Generator').default;

    describe('sparql2table', () => {
        it('Correctly transforms a SPARQL query result with a Literal and an URL', function () {
            const result = Utils.sparql2table([{
                'varName1': {'value': 'val', 'type': 'literal'},
                'varName2': {'value': 'http://example.org/book/book6', 'type': 'uri'}
            }]);

            expect(result.length).toEqual(1);
            expect(result[0].varName1).toEqual('val');
            expect(result[0].varName2).toEqual('http://example.org/book/book6');
        });
    });

    describe('generateMinMax', () => {
        it('generates correct min/max from a list of "year", "month" attributes', () => {
            const input = [{year: 2017, month: 1}, {year: 2005, month: 3}, {year: 2001, month: 12}, {
                year: 1981,
                month: 5
            }, {year: 1945, month: 5}];
            const result = Utils.generateMinMax(input);
            expect(result.min).toEqual(194505);
            expect(result.max).toEqual(201701);
        });
    });

    describe('generateMonthTimeAxis', () => {
        it('generates correct Month Time Axis from the predefined min and max date', () => {
            const input = [{year: 2017, month: 1}, {year: 2005, month: 3}, {year: 2001, month: 12}, {
                year: 1981,
                month: 5
            }, {year: 1945, month: 5}];
            const result = Utils.generateMonthTimeAxis(200110, 200308);
            expect(result.length).toEqual(23);
        });
    });

    describe('getDateInt', () => {
        it('transforms year/month combination to integer', () => {
            expect(Utils.getDateInt(2007,10)).toEqual(200710);
            expect(Utils.getDateInt(2007,1)).toEqual(200701);
        });
    });

    describe('unique', () => {
        it('generates correct unique list', () => {
            expect(Utils.unique([1, 2, 3]).length).toEqual(3);
            expect(Utils.unique([1, 2, 3, 1, 1, 2]).length).toEqual(3);
        });
    });
});