'use strict';

describe('ReportsController', () => {

    const React = require('react'),
        TestUtils = require('react-addons-test-utils'),
        Environment = require('../environment/Environment'),
        Generator = require('../environment/Generator').default,

        Actions = require('../../js/actions/Actions'),
        ComponentStateStore = require('../../js/stores/ComponentStateStore'),
        Constants = require('../../js/constants/Constants'),
        RouterStore = require('../../js/stores/RouterStore'),
        Routing = require('../../js/utils/Routing'),
        Routes = require('../../js/utils/Routes'),
        ReportsController = require('../../js/components/report/ReportsController').default,
        Reports = require('../../js/components/report/Reports').default;
    let reports, location;

    beforeEach(() => {
        jasmine.addMatchers(Environment.customMatchers);
        spyOn(Actions, 'loadAllReports');
        spyOn(Actions, 'loadOptions');
        reports = Generator.generateReports();
        location = {            // Simulating location supplied normally by React Router
            pathname: '',
            query: {}
        };
        spyOn(RouterStore, 'getTransitionPayload').and.returnValue(null);
        spyOn(ComponentStateStore, 'getComponentState').and.returnValue(null);
    });

    it('initializes report sort with default values', () => {
        const controller = Environment.render(<ReportsController location={location}/>);
        expect(controller.state.sort).toBeDefined();
        expect(controller.state.sort.identification).toEqual(Constants.SORTING.NO);
        expect(controller.state.sort.date).toEqual(Constants.SORTING.NO);
    });

    it('shows only reports of the corresponding type when type filter is triggered', () => {
        const controller = Environment.render(<ReportsController location={location}/>),
            reportsComponent = TestUtils.findRenderedComponentWithType(controller, Reports);
        let renderedReports, filter,
            phase = 'http://onto.fel.cvut.cz/ontologies/inbas-test/first',
            phaseCnt = 0;
        for (let i = 0, len = reports.length; i < len; i++) {
            if (Generator.getRandomBoolean()) {
                reports[i].phase = phase;
                phaseCnt++;
            }
        }
        controller._onReportsLoaded({action: Actions.loadAllReports, reports: reports});
        renderedReports = reportsComponent.props.reports;
        expect(renderedReports).toEqual(reports);

        filter = {phase: phase};
        controller.onFilterChange(filter);
        renderedReports = reportsComponent.props.reports;
        expect(renderedReports.length).toEqual(phaseCnt);
        for (let i = 0, len = renderedReports.length; i < len; i++) {
            expect(renderedReports[i].phase).toEqual(phase);
        }
    });

    it('sorts reports descending, ascending by identification', () => {
        const controller = Environment.render(<ReportsController location={location}/>),
            reportsComponent = TestUtils.findRenderedComponentWithType(controller, Reports);
        Generator.shuffleArray(reports);
        controller._onReportsLoaded({action: Actions.loadAllReports, reports: reports});
        let renderedReports = reportsComponent.props.reports;
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
        const renderedReports = component.props.reports;
        expect(renderedReports.length).toEqual(reports.length);
        for (let i = 1, len = renderedReports.length; i < len; i++) {
            if (not) {
                expect(renderedReports[i][orderAtt]).not[comparisonFn](renderedReports[i - 1][orderAtt]);
            } else {
                expect(renderedReports[i][orderAtt])[comparisonFn](renderedReports[i - 1][orderAtt]);
            }
        }
    }

    it('sorts reports descending, ascending by date', () => {
        const controller = Environment.render(<ReportsController location={location}/>),
            reportsComponent = TestUtils.findRenderedComponentWithType(controller, Reports);
        Generator.shuffleArray(reports);
        controller._onReportsLoaded({action: Actions.loadAllReports, reports: reports});
        let renderedReports = reportsComponent.props.reports;
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
        const controller = Environment.render(<ReportsController location={location}/>),
            reportsComponent = TestUtils.findRenderedComponentWithType(controller, Reports);
        Generator.shuffleArray(reports);
        setEqualIdentifications();
        controller._onReportsLoaded({action: Actions.loadAllReports, reports: reports});
        let renderedReports = reportsComponent.props.reports;
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
        const filter = {
            phase: 'http://onto.fel.cvut.cz/ontologies/inbas-test/first'
        };
        RouterStore.getTransitionPayload.and.returnValue({filter: filter});
        const controller = Environment.render(<ReportsController location={location}/>);
        expect(controller.state.filter).toEqual(filter);
    });

    it('clears transition payload after it has read it', () => {
        const filter = {
            phase: 'http://onto.fel.cvut.cz/ontologies/inbas-test/first'
        };
        RouterStore.getTransitionPayload.and.returnValue({filter: filter});
        spyOn(RouterStore, 'clearTransitionPayload');
        Environment.render(<ReportsController location={location}/>);
        expect(RouterStore.clearTransitionPayload).toHaveBeenCalledWith(Routes.reports.name);
    });

    it('loads filter and sort state from ComponentStateStore', () => {
        const filter = {
            phase: 'http://onto.fel.cvut.cz/ontologies/inbas-test/first'
        }, sort = {
            identification: Constants.SORTING.DESC,
            date: Constants.SORTING.ASC
        };
        ComponentStateStore.getComponentState.and.returnValue({filter: filter, sort: sort});
        const controller = Environment.render(<ReportsController location={location}/>);
        expect(ComponentStateStore.getComponentState).toHaveBeenCalledWith(
            ReportsController.WrappedComponent.WrappedComponent.displayName);
        expect(controller.state.filter).toEqual(filter);
        expect(controller.state.sort).toEqual(sort);
    });

    it('saves component filtering and sorting when filter changes', () => {
        const filter = {
                phase: 'http://onto.fel.cvut.cz/ontologies/inbas-test/first'
            },
            controller = Environment.render(<ReportsController location={location}/>);
        Environment.bindActionsToStoreMethods('rememberComponentState', ComponentStateStore);
        spyOn(ComponentStateStore, 'onRememberComponentState').and.callThrough();
        const sort = controller.state.sort;

        controller.onFilterChange(filter);
        expect(ComponentStateStore.onRememberComponentState).toHaveBeenCalledWith(
            ReportsController.WrappedComponent.WrappedComponent.displayName, {
                filter: filter,
                sort: sort
            });
    });

    it('saves component filtering and sorting when sort is called', () => {
        let sort, filter,
            controller = Environment.render(<ReportsController location={location}/>);
        Environment.bindActionsToStoreMethods('rememberComponentState', ComponentStateStore);
        spyOn(ComponentStateStore, 'onRememberComponentState').and.callThrough();
        controller.onSort('identification');
        controller.onSort('date');
        sort = controller.state.sort;
        filter = controller.state.filter;

        expect(ComponentStateStore.onRememberComponentState).toHaveBeenCalledWith(
            ReportsController.WrappedComponent.WrappedComponent.displayName, {
                filter: filter,
                sort: sort
            });
    });

    it('loads all reports when no report keys are specified', () => {
        Environment.render(<ReportsController location={location}/>);
        expect(Actions.loadAllReports).toHaveBeenCalledWith();
    });

    it('loads reports by keys when report keys are specified in location', () => {
        const keys = [];
        for (let i = 0, cnt = Generator.getRandomPositiveInt(1, 5); i < cnt; i++) {
            keys.push(Generator.getRandomInt().toString());
        }
        location.query['reportKey'] = keys;

        Environment.render(<ReportsController location={location}/>);
        expect(Actions.loadAllReports).toHaveBeenCalledWith(keys);
    });

    it('loads single report when report keys specified in location contain only one key', () => {
        const key = Generator.getRandomInt().toString();
        location.query['reportKey'] = key;

        Environment.render(<ReportsController location={location}/>);
        expect(Actions.loadAllReports).toHaveBeenCalledWith([key]);
    });

    it('sorts reports descending by date correctly when some do not have date and some have date 0', () => {
        const reportsToSort = reports.slice(0, 3);
        reportsToSort[0].date = 0;
        delete reportsToSort[1].date;
        const controller = Environment.render(<ReportsController location={location}/>);
        controller._onReportsLoaded({action: Actions.loadAllReports, reports: reportsToSort});
        controller.onSort('date');
        const reportsComponent = TestUtils.findRenderedComponentWithType(controller, Reports),
            reportsToRender = reportsComponent.props.reports;
        expect(reportsToRender[0]).toEqual(reportsToSort[2]);
        expect(reportsToRender[1]).toEqual(reportsToSort[0]);
        expect(reportsToRender[2]).toEqual(reportsToSort[1]);
    });

    function setEqualIdentifications() {
        let ind,
            identification = 'AAAA';
        for (let i = 0, cnt = Generator.getRandomPositiveInt(1, reports.length); i < cnt; i++) {
            ind = Generator.getRandomInt(reports.length);
            reports[ind].identification = identification;
        }
    }

    function verifyCombinedOrder(component, descending) {
        const renderedReports = component.props.reports;
        expect(renderedReports.length).toEqual(reports.length);
        for (let i = 1, len = renderedReports.length; i < len; i++) {
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
});
