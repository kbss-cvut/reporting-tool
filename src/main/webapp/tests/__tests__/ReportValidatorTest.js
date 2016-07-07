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

describe('Report validator', function () {

    var ReportValidator = require('../../js/validation/ReportValidator'),
        Constants = require('../../js/constants/Constants'),
        report;

    beforeEach(function () {
        report = {
            occurrence: {
                name: 'TestReport',
                startTime: Date.now() - 1000,
                endTime: Date.now(),
                eventType: 'http://onto.fel.cvut.cz/ontologies/eccairs-1.3.0.8/V-24-430-28'
            },
            severityAssessment: 'INCIDENT',
            summary: 'Report narrative',
            typeAssessments: [{
                eventType: {
                    id: 'http://onto.fel.cvut.cz/ontologies/eccairs-1.3.0.8/V-24-1-31-31-14-390-2000000-2200000-2200100',
                    name: '2200100 - Runway incursions'
                }
            }]
        };
    });

    it('marks valid report as valid', function () {
        expect(ReportValidator.isValid(report)).toBeTruthy();
    });

    it('marks report without occurrence as invalid', () => {
        delete report.occurrence;
        expect(ReportValidator.isValid(report)).toBeFalsy();
    });

    it('marks report without headline as invalid', function () {
        report.occurrence.name = '';
        expect(ReportValidator.isValid(report)).toBeFalsy();
    });

    it('marks report without severity assessment as invalid', function () {
        delete report.severityAssessment;
        expect(ReportValidator.isValid(report)).toBeFalsy();
    });

    it('marks report without occurrence category as invalid', function () {
        delete report.occurrence.eventType;
        expect(ReportValidator.isValid(report)).toBeFalsy();
    });

    it('marks report without narrative as invalid', function () {
        report.summary = '';
        expect(ReportValidator.isValid(report)).toBeFalsy();
    });

    it('returns missing field message when report without narrative is validated', function () {
        report.summary = '';
        expect(ReportValidator.getValidationMessage(report)).toEqual('detail.invalid-tooltip');
    });

    it('marks report with too large occurrence start and end time diff as invalid', function () {
        report.occurrence.startTime = Date.now() - Constants.MAX_OCCURRENCE_START_END_DIFF - 1000;
        report.occurrence.endTime = Date.now();
        expect(ReportValidator.isValid(report)).toBeFalsy();
    });

    it('reports time difference error message when report with too large occurrence start and end time diff is validated', function () {
        report.occurrence.startTime = Date.now() - Constants.MAX_OCCURRENCE_START_END_DIFF - 1000;
        report.occurrence.endTime = Date.now();
        expect(ReportValidator.getValidationMessage(report)).toEqual('detail.large-time-diff-tooltip');
    });

    it('marks report with too large occurrence start and end time diff as not renderable', function () {
        report.occurrence.startTime = Date.now() - Constants.MAX_OCCURRENCE_START_END_DIFF - 1000;
        report.occurrence.endTime = Date.now();
        expect(ReportValidator.canRender(report)).toBeFalsy();
    });
});