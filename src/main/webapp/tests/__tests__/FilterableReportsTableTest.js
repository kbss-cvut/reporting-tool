'use strict';

describe('Filterable reports table', function () {

    var React = require('react'),
        assign = require('object-assign'),
        TestUtils = require('react-addons-test-utils'),
        Environment = require('../environment/Environment'),
        Generator = require('../environment/Generator').default,
        Actions = require('../../js/actions/Actions'),
        FilterableReportsTable = require('../../js/components/report/FilterableReportsTable'),
        Constants = require('../../js/constants/Constants'),
        Vocabulary = require('../../js/constants/Vocabulary'),
        ReportType = require('../../js/model/ReportType'),

        onFilterChange,
        actions;

    beforeEach(function () {
        spyOn(ReportType, 'getReport').and.callFake((data) => {
            var obj = assign({}, data);
            obj.renderMoreInfo = () => '';
            obj.getPrimaryLabel = () => 'Label';
            obj.getLabels = () => 'Label';
            obj.getPhase = () => '';
            return obj;
        });
        onFilterChange = jasmine.createSpy('onFilterChange');
        actions = {
            onFilterChange: onFilterChange
        };
        spyOn(Actions, 'loadOptions');
    });

    it('shows a set of existing report types in the filter', function () {
        var reports = prepareReports(),
            uniqueTypes = resolveReportTypes(reports),
            filter = Environment.render(<FilterableReportsTable actions={actions} allReports={reports}
                                                                reports={reports}/>);

        var options = filter._getReportTypes();
        expect(options.length).toEqual(uniqueTypes.length);
        for (var i = 0, len = options.length; i < len; i++) {
            if (options[i].type !== Constants.FILTER_DEFAULT) {
                expect(uniqueTypes.indexOf(options[i].type)).not.toEqual(-1);
            }
        }
    });

    function prepareReports() {
        return [
            {
                key: '123345',
                uri: Generator.getRandomUri(),
                types: [Vocabulary.OCCURRENCE_REPORT]
            },
            {
                key: '542321',
                uri: Generator.getRandomUri(),
                types: [Vocabulary.OCCURRENCE_REPORT]
            },
            {
                key: '555444',
                uri: Generator.getRandomUri(),
                types: ['http://onto.fel.cvut.cz/ontologies/documentation/safety_issue_report']
            },
            {
                key: '111222',
                uri: Generator.getRandomUri(),
                types: ['http://onto.fel.cvut.cz/ontologies/documentation/audit_report']
            }
        ]
    }

    function resolveReportTypes(reports) {
        var cats = [], report, i, j, len;
        spyOn(ReportType, 'getTypeLabel').and.callFake((type) => type);
        for (i = 0, len = reports.length; i < len; i++) {
            report = reports[i];
            for (j = 0; j < report.types.length; j++) {
                if (cats.indexOf(report.types[j]) === -1) {
                    cats.push(report.types[j]);
                }
            }
        }
        cats.sort((a, b) => a.localeCompare(b));
        return cats;
    }

    it('calls filter change when filter value changes', function () {
        var reports = prepareReports(),
            uniqueTypes = resolveReportTypes(reports),
            filter = Environment.render(<FilterableReportsTable actions={actions} allReports={reports}
                                                                reports={reports}/>),
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
            filter;

        resolveReportTypes(reports);
        filter = Environment.render(<FilterableReportsTable actions={actions} allReports={reports} reports={reports}/>);
        Object.getOwnPropertyNames(filter.state).forEach((key) => {
            filter.state[key] = Generator.getRandomInt();
        });
        filter.onResetFilters();
        Object.getOwnPropertyNames(filter.state).forEach((key) => {
            expect(filter.state[key]).toEqual(Constants.FILTER_DEFAULT);
        });
        expect(onFilterChange).toHaveBeenCalled();
    });

    it('renders buttons for all existing report types', () => {
        var reports = prepareReports(),
            types = resolveReportTypes(reports),
            filter = Environment.render(<FilterableReportsTable actions={actions} allReports={reports}
                                                                reports={reports}/>),

            toolbar = TestUtils.findRenderedComponentWithType(filter, require('react-bootstrap').ButtonToolbar),
            buttons = TestUtils.scryRenderedDOMComponentsWithTag(toolbar, 'button');
        expect(buttons.length).toEqual(types.length + 1);   // + the All button
    });

    it('removes the \'All\' type when other type is selected', () => {
        var reports = prepareReports(),
            types = resolveReportTypes(reports),
            filter = Environment.render(<FilterableReportsTable actions={actions} allReports={reports}
                                                                reports={reports}/>),

            toolbar = TestUtils.findRenderedComponentWithType(filter, require('react-bootstrap').ButtonToolbar),
            buttons = TestUtils.scryRenderedDOMComponentsWithTag(toolbar, 'button'),
            index = Generator.getRandomInt(types.length),
            selectedType = types[index],
            typeButton = buttons[index + 1]; // Skip the All button
        TestUtils.Simulate.click(typeButton);
        expect(onFilterChange).toHaveBeenCalled();
        var newFilter = onFilterChange.calls.argsFor(0)[0];
        expect(newFilter['types']).toEqual([selectedType]);
    });

    it('adds type to filter when additional type is selected', () => {
        var reports = prepareReports(),
            types = resolveReportTypes(reports),
            filter = Environment.render(<FilterableReportsTable actions={actions} allReports={reports}
                                                                reports={reports}/>),

            toolbar = TestUtils.findRenderedComponentWithType(filter, require('react-bootstrap').ButtonToolbar),
            buttons = TestUtils.scryRenderedDOMComponentsWithTag(toolbar, 'button'), button, newFilter;
        for (var i = 0, len = types.length; i < len; i++) {
            button = buttons[i + 1];
            TestUtils.Simulate.click(button);
            newFilter = onFilterChange.calls.argsFor(i)[0];
            for (var j = 0; j < i; j++) {
                expect(newFilter['types'].indexOf(types[j])).not.toEqual(-1);
            }
            expect(newFilter['types'].indexOf(types[i])).not.toEqual(-1);
        }
    });

    it('removes selection of other types when \'All\' is selected', () => {
        var reports = prepareReports(),
            types = resolveReportTypes(reports),
            filter = Environment.render(<FilterableReportsTable actions={actions} allReports={reports}
                                                                reports={reports}/>),

            toolbar = TestUtils.findRenderedComponentWithType(filter, require('react-bootstrap').ButtonToolbar),
            buttons = TestUtils.scryRenderedDOMComponentsWithTag(toolbar, 'button'),
            index = Generator.getRandomInt(types.length),
            selectedType = types[index],
            typeButton = buttons[index + 1]; // Skip the All button
        TestUtils.Simulate.click(typeButton);
        var newFilter = onFilterChange.calls.argsFor(0)[0];
        expect(newFilter['types']).toEqual([selectedType]);

        TestUtils.Simulate.click(buttons[0]);   // Selected the All button
        newFilter = onFilterChange.calls.argsFor(1)[0];
        expect(newFilter['types']).toEqual(Constants.FILTER_DEFAULT);
    });

    it('does not show report type filter buttons when there is only one type of reports', () => {
        var reports = [], report;
        for (var i = 0, cnt = Generator.getRandomPositiveInt(5, 10); i < cnt; i++) {
            report = Generator.generateOccurrenceReport();
            report.types = [Vocabulary.OCCURRENCE_REPORT];
            report.uri = Generator.getRandomUri();
            reports.push(report);
        }
        var filter = Environment.render(<FilterableReportsTable actions={actions} allReports={reports}
                                                                reports={reports}/>),

            toolbar = TestUtils.scryRenderedComponentsWithType(filter, require('react-bootstrap').ButtonToolbar);
        expect(toolbar.length).toEqual(0);
    });

    it('removes filter when the button is toggled again', () => {
        var reports = prepareReports(),
            types = resolveReportTypes(reports),
            filter = Environment.render(<FilterableReportsTable actions={actions} allReports={reports}
                                                                reports={reports}/>),

            toolbar = TestUtils.findRenderedComponentWithType(filter, require('react-bootstrap').ButtonToolbar),
            buttons = TestUtils.scryRenderedDOMComponentsWithTag(toolbar, 'button'), button, newFilter;
        for (var i = 0, len = types.length; i < len; i++) {
            button = buttons[i + 1];
            TestUtils.Simulate.click(button);
            newFilter = onFilterChange.calls.argsFor(i)[0];
            expect(newFilter['types'].indexOf(types[i])).not.toEqual(-1);
        }
        for (i = 0, len = types.length; i < len; i++) {
            button = buttons[i + 1];
            TestUtils.Simulate.click(button);
            newFilter = onFilterChange.calls.argsFor(i + types.length)[0];
            expect(newFilter['types'].indexOf(types[i])).toEqual(-1);   // Type removed from filter
        }
    });

    it('sets type filter back to \'All\' when the last remaining filter button is toggled again', () => {
        var reports = prepareReports(),
            types = resolveReportTypes(reports),
            filter = Environment.render(<FilterableReportsTable actions={actions} allReports={reports}
                                                                reports={reports}/>),

            toolbar = TestUtils.findRenderedComponentWithType(filter, require('react-bootstrap').ButtonToolbar),
            buttons = TestUtils.scryRenderedDOMComponentsWithTag(toolbar, 'button'),
            index = Generator.getRandomInt(types.length),
            selectedType = types[index],
            typeButton = buttons[index + 1]; // Skip the All button
        TestUtils.Simulate.click(typeButton);
        var newFilter = onFilterChange.calls.argsFor(0)[0];
        expect(newFilter['types']).toEqual([selectedType]);

        TestUtils.Simulate.click(typeButton);   // Selected the All button
        newFilter = onFilterChange.calls.argsFor(1)[0];
        expect(newFilter['types']).toEqual(Constants.FILTER_DEFAULT);
    });

    it('passes remembered filter values to the Filters component', () => {
        var reports = prepareReports(),
            filterPath = Constants.FILTERS[0].path,
            cat = Generator.randomCategory().id,
            filters = {};
        filters[filterPath] = cat;

        var component = Environment.render(<FilterableReportsTable actions={actions} allReports={reports}
                                                                   reports={reports} filter={filters}/>);
        var trigger = TestUtils.findRenderedComponentWithType(component, require('react-bootstrap').OverlayTrigger),
            button = TestUtils.findRenderedDOMComponentWithTag(trigger, 'button');
        TestUtils.Simulate.click(button);

        var filtersComp = component.filters;
        expect(filtersComp.props.filters[filterPath]).toEqual(cat);
    });
});
