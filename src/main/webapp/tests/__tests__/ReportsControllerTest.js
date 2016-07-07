'use strict';

describe('ReportsController', () => {

    var React = require('react'),
        TestUtils = require('react-addons-test-utils'),
        Environment = require('../environment/Environment'),
        Generator = require('../environment/Generator').default,

        Actions = require('../../js/actions/Actions'),
        ComponentStateStore = require('../../js/stores/ComponentStateStore'),
        Constants = require('../../js/constants/Constants'),
        RouterStore = require('../../js/stores/RouterStore'),
        Routing = require('../../js/utils/Routing'),
        Routes = require('../../js/utils/Routes'),
        ReportsController = require('../../js/components/report/ReportsController'),
        Reports = require('../../js/components/report/Reports'),
        reports;

    beforeEach(() => {
        jasmine.addMatchers(Environment.customMatchers);
        spyOn(Actions, 'loadAllReports');
        spyOn(Actions, 'loadEventTypes');
        spyOn(Actions, 'loadOptions');
        reports = Generator.generateReports();
    });

    it('initializes report sort with default values', () => {
        var controller = Environment.render(<ReportsController />);
        expect(controller.state.sort).toBeDefined();
        expect(controller.state.sort.identification).toEqual(Constants.SORTING.NO);
        expect(controller.state.sort.date).toEqual(Constants.SORTING.NO);
    });

    it('shows only reports of the corresponding type when type filter is triggered', () => {
        var controller = Environment.render(<ReportsController />),
            reportsComponent = TestUtils.findRenderedComponentWithType(controller, Reports),
            renderedReports, filter, i, len,
            phase = 'http://onto.fel.cvut.cz/ontologies/inbas-test/first',
            phaseCnt = 0;
        for (i = 0, len = reports.length; i < len; i++) {
            if (Generator.getRandomBoolean()) {
                reports[i].phase = phase;
                phaseCnt++;
            }
        }
        controller.onReportsLoaded({action: Actions.loadAllReports, reports: reports});
        renderedReports = reportsComponent.props.reports;
        expect(renderedReports).toEqual(reports);

        filter = {phase: phase};
        controller.onFilterChange(filter);
        renderedReports = reportsComponent.props.reports;
        expect(renderedReports.length).toEqual(phaseCnt);
        for (i = 0, len = renderedReports.length; i < len; i++) {
            expect(renderedReports[i].phase).toEqual(phase);
        }
    });

    it('sorts reports descending, ascending by identification', () => {
        var controller = Environment.render(<ReportsController />),
            reportsComponent = TestUtils.findRenderedComponentWithType(controller, Reports),
            renderedReports;
        randomShuffle(reports);
        controller.onReportsLoaded({action: Actions.loadAllReports, reports: reports});
        renderedReports = reportsComponent.props.reports;
        expect(Environment.arraysEqual(reports, renderedReports)).toBeTruthy();

        controller.onSort('identification');    // Descending
        verifyOrder(reportsComponent, 'identification', 'toBeLexGreaterOrEqual', true);
        controller.onSort('identification');    // Ascending
        verifyOrder(reportsComponent, 'identification', 'toBeLexGreaterOrEqual', false);
        controller.onSort('identification');    // No sort
        renderedReports = reportsComponent.props.reports;
        expect(Environment.arraysEqual(reports, renderedReports)).toBeTruthy();
    });

    function verifyOrder(component, orderAtt, comparisonFn, not) {
        var renderedReports = component.props.reports;
        expect(renderedReports.length).toEqual(reports.length);
        for (var i = 1, len = renderedReports.length; i < len; i++) {
            if (not) {
                expect(renderedReports[i][orderAtt]).not[comparisonFn](renderedReports[i - 1][orderAtt]);
            } else {
                expect(renderedReports[i][orderAtt])[comparisonFn](renderedReports[i - 1][orderAtt]);
            }
        }
    }

    it('sorts reports descending, ascending by date', () => {
        var controller = Environment.render(<ReportsController />),
            reportsComponent = TestUtils.findRenderedComponentWithType(controller, Reports),
            renderedReports;
        randomShuffle(reports);
        controller.onReportsLoaded({action: Actions.loadAllReports, reports: reports});
        renderedReports = reportsComponent.props.reports;
        expect(Environment.arraysEqual(reports, renderedReports)).toBeTruthy();

        controller.onSort('date');      // Descending
        verifyOrder(reportsComponent, 'date', 'toBeGreaterThan', true);
        controller.onSort('date');      // Ascending
        verifyOrder(reportsComponent, 'date', 'toBeLessThan', true);
        controller.onSort('date');      // No sort
        renderedReports = reportsComponent.props.reports;
        expect(Environment.arraysEqual(reports, renderedReports)).toBeTruthy();
    });

    it('sorts reports descending, ascending by identification and date', () => {
        var controller = Environment.render(<ReportsController />),
            reportsComponent = TestUtils.findRenderedComponentWithType(controller, Reports),
            renderedReports;
        randomShuffle(reports);
        setEqualIdentifications();
        controller.onReportsLoaded({action: Actions.loadAllReports, reports: reports});
        renderedReports = reportsComponent.props.reports;
        expect(Environment.arraysEqual(reports, renderedReports)).toBeTruthy();
        // Descending
        controller.onSort('date');
        controller.onSort('identification');
        verifyCombinedOrder(reportsComponent, true);
        // Ascending
        controller.onSort('date');
        controller.onSort('identification');
        verifyCombinedOrder(reportsComponent, false);
    });

    it('uses filter passed in in transition payload', () => {
        var filter = {
            phase: 'http://onto.fel.cvut.cz/ontologies/inbas-test/first'
        }, controller;
        spyOn(RouterStore, 'getTransitionPayload').and.returnValue({filter: filter});
        controller = Environment.render(<ReportsController/>);
        expect(controller.state.filter).toEqual(filter);
    });

    it('passes initial filter setting to the filter component', () => {
        var filter = {
            phase: 'http://onto.fel.cvut.cz/ontologies/inbas-test/first'
        }, controller;
        spyOn(RouterStore, 'getTransitionPayload').and.returnValue({filter: filter});
        controller = Environment.render(<ReportsController/>);
        controller.onReportsLoaded({action: Actions.loadAllReports, reports: reports});
        var filters = TestUtils.scryRenderedComponentsWithType(controller, require('../../js/components/Select'));
        var phaseFilter = filters.find((item) => {
            return item.props.name === 'phase';
        });
        expect(phaseFilter.props.value).toEqual(filter.phase);
    });

    it('clears transition payload after it has read it', () => {
        var filter = {
            phase: 'http://onto.fel.cvut.cz/ontologies/inbas-test/first'
        };
        spyOn(RouterStore, 'getTransitionPayload').and.returnValue({filter: filter});
        spyOn(RouterStore, 'setTransitionPayload');
        Environment.render(<ReportsController/>);
        expect(RouterStore.setTransitionPayload).toHaveBeenCalledWith(Routes.reports.name);
    });

    it('loads filter and sort state from ComponentStateStore', () => {
        var filter = {
            phase: 'http://onto.fel.cvut.cz/ontologies/inbas-test/first'
        }, sort = {
            identification: Constants.SORTING.DESC,
            date: Constants.SORTING.ASC
        };
        spyOn(ComponentStateStore, 'getComponentState').and.returnValue({filter: filter, sort: sort});
        var controller = Environment.render(<ReportsController/>);
        expect(ComponentStateStore.getComponentState).toHaveBeenCalledWith(ReportsController.displayName);
        expect(controller.state.filter).toEqual(filter);
        expect(controller.state.sort).toEqual(sort);
    });

    it('saves component filtering and sorting when filter changes', () => {
        var filter = {
                phase: 'http://onto.fel.cvut.cz/ontologies/inbas-test/first'
            }, sort,
            controller = Environment.render(<ReportsController/>);
        Environment.bindActionsToStoreMethods('rememberComponentState', ComponentStateStore);
        spyOn(ComponentStateStore, 'onRememberComponentState').and.callThrough();
        sort = controller.state.sort;

        controller.onFilterChange(filter);
        expect(ComponentStateStore.onRememberComponentState).toHaveBeenCalledWith(ReportsController.displayName, {
            filter: filter,
            sort: sort
        });
    });

    it('saves component filtering and sorting when sort is called', () => {
        var sort, filter,
            controller = Environment.render(<ReportsController/>);
        Environment.bindActionsToStoreMethods('rememberComponentState', ComponentStateStore);
        spyOn(ComponentStateStore, 'onRememberComponentState').and.callThrough();
        controller.onSort('identification');
        controller.onSort('date');
        sort = controller.state.sort;
        filter = controller.state.filter;

        expect(ComponentStateStore.onRememberComponentState).toHaveBeenCalledWith(ReportsController.displayName, {
            filter: filter,
            sort: sort
        });
    });

    function setEqualIdentifications() {
        var ind,
            identification = 'AAAA';
        for (var i = 0, cnt = Generator.getRandomPositiveInt(1, reports.length); i < cnt; i++) {
            ind = Generator.getRandomInt(reports.length);
            reports[ind].identification = identification;
        }
    }

    function verifyCombinedOrder(component, descending) {
        var renderedReports = component.props.reports;
        expect(renderedReports.length).toEqual(reports.length);
        for (var i = 1, len = renderedReports.length; i < len; i++) {
            if (descending) {
                expect(renderedReports[i].identification).not.toBeLexGreaterThan(renderedReports[i - 1].identification);
            } else {
                expect(renderedReports[i].identification).toBeLexGreaterOrEqual(renderedReports[i - 1].identification);
            }
            if (renderedReports[i].identification === renderedReports[i - 1].identification) {
                if (descending) {
                    expect(renderedReports[i].date).not.toBeGreaterThan(renderedReports[i - 1].date);
                } else {
                    expect(renderedReports[i].date).not.toBeLessThan(renderedReports[i - 1].date);
                }
            }
        }
    }

    /**
     * Knuth shuffle algorithm.
     */
    function randomShuffle(arr) {
        var currentIndex = arr.length,
            tmp, randomIndex;
        while (currentIndex !== 0) {
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex -= 1;

            tmp = arr[currentIndex];
            arr[currentIndex] = arr[randomIndex];
            arr[randomIndex] = tmp;
        }
        return arr;
    }
});
