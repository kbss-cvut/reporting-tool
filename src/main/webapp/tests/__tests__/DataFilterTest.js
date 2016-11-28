'use strict';

import DataFilter from "../../js/utils/DataFilter";
import Generator from "../environment/Generator";
import Vocabulary from "../../js/constants/Vocabulary";

const REPORT_TYPES = [
    Vocabulary.OCCURRENCE_REPORT,
    'http://onto.fel.cvut.cz/ontologies/documentation/safety_issue_report',
    'http://onto.fel.cvut.cz/ontologies/documentation/audit_report'
];

describe('Data filter', () => {

    var reports;

    beforeEach(() => {
        var report;
        reports = [];
        for (var i = 0; i < Generator.getRandomPositiveInt(10, 20); i++) {
            report = Generator.generateOccurrenceReport();
            report.types = [REPORT_TYPES[Generator.getRandomInt(REPORT_TYPES.length)]];
            reports.push(report);
        }
    });

    it('filters data by single property with single filter value', () => {
        var filter = {
                types: reports[0].types[0]
            },
            expected = reports.filter((item) => item.types[0] === filter.types),

            result = DataFilter.filterData(reports, filter);
        expect(result.length).toBeGreaterThan(0);
        expect(result).toEqual(expected);
    });

    it('filters data by single property with multiple filter values', () => {
        var filter = {
                types: [REPORT_TYPES[0], REPORT_TYPES[1]]
            },
            expected = reports.filter((item) => filter.types.indexOf(item.types[0]) !== -1),

            result = DataFilter.filterData(reports, filter);
        expect(result.length).toBeGreaterThan(0);
        expect(result).toEqual(expected);
    });

    it('filters data using filter with property path', () => {
        var eventType = reports[0].occurrence.eventType,
            filter = {
                'occurrence.eventType': eventType
            },
            expected = reports.filter((item) => item.occurrence.eventType === eventType),

            result = DataFilter.filterData(reports, filter);
        expect(result.length).toBeGreaterThan(0);
        expect(result).toEqual(expected);
    });

    it('filters out data which do not contain value corresponding to filter property path', () => {
        for (var i = 0; i < 5; i++) {
            reports.push({
                uri: Generator.getRandomUri(),
                key: Date.now(),
                safetyIssue: {
                    name: 'Safety issue ' + i
                }
            });
        }
        var eventType = reports[0].occurrence.eventType,
            filter = {
                'occurrence.eventType': eventType
            },
            expected = reports.filter((item) => item.occurrence && item.occurrence.eventType === eventType),

            result = DataFilter.filterData(reports, filter);
        expect(result.length).toBeGreaterThan(0);
        expect(result).toEqual(expected);
    });

    it('filters out data which do not correspond to one of the filter values', () => {
        reports = Generator.generateReports();
        var category = Generator.getCategories()[0],
            phase = Generator.getRandomUri(),
            expectedReports = [];
        for (var i = 0, len = reports.length; i < len; i++) {
            reports[i].occurrenceCategory = category.id;
            if (Generator.getRandomBoolean()) {
                reports[i].phase = phase;
                expectedReports.push(reports[i]);
            } else {
                // Just to be sure the phases are all different from the selected one
                reports[i].phase = phase + '-' + i;
            }
        }
        var filter = {
                'occurrenceCategory': category.id,
                'phase': phase
            },
            result = DataFilter.filterData(reports, filter);
        expect(result.length).toEqual(expectedReports.length);
        for (i = 0, len = result.length; i < len; i++) {
            expect(result[i].occurrenceCategory).toEqual(category.id);
            expect(result[i].phase).toEqual(phase);
        }
    });
});
