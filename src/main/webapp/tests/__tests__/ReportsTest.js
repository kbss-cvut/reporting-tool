'use strict';

describe('Reports', function () {

    var React = require('react'),
        rewire = require('rewire'),
        TestUtils = require('react-addons-test-utils'),
        Environment = require('../environment/Environment'),

        Reports = rewire('../../js/components/report/Reports'),
        ReportsFilter = require('../../js/components/report/ReportsFilter'),
        RouterStore = require('../../js/stores/RouterStore'),
        Routes = require('../../js/utils/Routes'),
        Constants = require('../../js/constants/Constants'),
        en = require('../../js/i18n/en'),

        actions = jasmine.createSpyObj('actions', ['onFilterChange']),
        Routing = jasmine.createSpyObj('Routing', ['transitionToHome']);

    beforeEach(function () {
        Reports.__set__('Routing', Routing);
    });

    it('shows message informing that there are no matching reports when filter finds no reports.', function () {
        var result = Environment.render(<Reports allReports={[{key: 1}]} reports={[]} actions={actions}
                                                 filter={{'occurrenceCategory.id': 'http://onto.fel.cvut.cz/ontologies/eccairs-1.3.0.8/V-24-430-1'}}/>),
            filter = TestUtils.scryRenderedComponentsWithType(result, ReportsFilter.wrappedComponent),
            message = Environment.getComponentByTagAndText(result, 'div', en.messages['reports.filter.no-matching-found']);

        expect(filter.length).toEqual(1);
        expect(message).not.toBeNull();
    });

    it('shows message with a link to dashboard when no reports exist.', function () {
        var result = Environment.render(<Reports allReports={[]} reports={[]} actions={actions}/>),
            filter = TestUtils.scryRenderedComponentsWithType(result, ReportsFilter.wrappedComponent),
            message = Environment.getComponentByTagAndText(result, 'div', en.messages['reports.no-reports'] + en.messages['reports.no-reports.link']),
            link = Environment.getComponentByTagAndText(result, 'a', en.messages['reports.no-reports.link']);

        expect(filter.length).toEqual(1);
        expect(message).not.toBeNull();
        expect(link).not.toBeNull();
    });

    it('sets dashboard in RouterStore on create report click', function () {
        Routing.transitionToHome.and.callFake(function (options) {
            RouterStore.setTransitionPayload(Routes.dashboard.name, options.payload);
        });
        var result = Environment.render(<Reports allReports={[]} reports={[]} actions={actions}/>);

        expect(RouterStore.getTransitionPayload(Routes.dashboard.name)).not.toBeDefined();
        result.createReport();
        expect(RouterStore.getTransitionPayload(Routes.dashboard.name)).toBeDefined();
        expect(RouterStore.getTransitionPayload(Routes.dashboard.name).dashboard).toEqual(Constants.DASHBOARDS.CREATE_REPORT.id);
    });
});
