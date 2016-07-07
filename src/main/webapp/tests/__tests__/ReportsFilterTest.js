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

describe('ReportsFilter', function () {

    var React = require('react'),
        rewire = require('rewire'),
        Environment = require('../environment/Environment'),
        Generator = require('../environment/Generator').default,
        ReportsFilter = rewire('../../js/components/report/ReportsFilter'),
        Constants = require('../../js/constants/Constants'),
        Vocabulary = require('../../js/constants/Vocabulary'),
        ReportType,

        onFilterChange;

    beforeEach(function () {
        ReportType = jasmine.createSpyObj('ReportType', ['getTypeLabel']);
        ReportsFilter.__set__('ReportType', ReportType);
        onFilterChange = jasmine.createSpy('onFilterChange');
    });

    it('shows a set of existing report types in the filter', function () {
        var reports = prepareReports(),
            uniqueTypes = resolveReportTypes(reports),
            filter = Environment.renderIntoTable(<ReportsFilter onFilterChange={onFilterChange} reports={reports}/>);

        var options = filter._getReportTypeOptions();
        expect(options.length).toEqual(uniqueTypes.length);
        for (var i = 0, len = options.length; i < len; i++) {
            if (options[i].value !== 'all') {
                expect(uniqueTypes.indexOf(options[i].value)).not.toEqual(-1);
            }
        }
    });

    function prepareReports() {
        return [
            {
                key: '123345',
                types: [Vocabulary.OCCURRENCE_REPORT]
            },
            {
                key: '542321',
                types: [Vocabulary.OCCURRENCE_REPORT]
            },
            {
                key: '555444',
                types: ['http://onto.fel.cvut.cz/ontologies/documentation/safety_issue_report']
            },
            {
                key: '111222',
                types: ['http://onto.fel.cvut.cz/ontologies/documentation/audit_report']
            }
        ]
    }

    function resolveReportTypes(reports) {
        var cats = [], report, i, j, len;
        for (i = 0, len = reports.length; i < len; i++) {
            report = reports[i];
            for (j = 0; j < report.types.length; j++) {
                if (cats.indexOf(report.types[j]) === -1) {
                    cats.push(report.types[j]);
                    ReportType.getTypeLabel.and.returnValue(report.types[j]);
                }
            }
        }
        return cats;
    }

    it('calls filter change when filter value changes', function () {
        var reports = prepareReports(),
            uniqueTypes = resolveReportTypes(reports),
            filter = Environment.renderIntoTable(<ReportsFilter onFilterChange={onFilterChange} reports={reports}/>),
            evt = {
                target: {
                    name: 'types',
                    value: uniqueTypes[0]
                }
            };

        filter.onSelect(evt);
        expect(filter.state[evt.target.name]).toEqual(uniqueTypes[0]);
        expect(onFilterChange).toHaveBeenCalledWith({'types': uniqueTypes[0]});
    });

    it('sets filter to default value on reset filter trigger', function () {
        var reports = prepareReports(),
            filter = Environment.renderIntoTable(<ReportsFilter onFilterChange={onFilterChange} reports={reports}/>),
            key;

        Object.getOwnPropertyNames(filter.state).forEach((key) => {
            filter.state[key] = Generator.getRandomInt();
        });
        filter.onResetFilters();
        Object.getOwnPropertyNames(filter.state).forEach((key) => {
            expect(filter.state[key]).toEqual(Constants.FILTER_DEFAULT);
        });
        expect(onFilterChange).toHaveBeenCalled();
    });
});