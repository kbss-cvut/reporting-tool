'use strict';

describe('Reports', function () {

    const React = require('react'),
        rewire = require('rewire'),
        Environment = require('../environment/Environment'),

        Reports = require('../../js/components/report/Reports').default,
        RouterStore = require('../../js/stores/RouterStore'),
        Routes = require('../../js/utils/Routes'),
        Routing = require('../../js/utils/Routing'),
        Constants = require('../../js/constants/Constants'),
        en = require('../../js/i18n/en'),

        actions = jasmine.createSpyObj('actions', ['onFilterChange']);

    beforeEach(function () {
        spyOn(Routing, 'transitionToHome');
    });

    it('shows message informing that there are no matching reports when filter finds no reports.', function () {
        const result = Environment.render(<Reports allReports={[{key: 1}]} reports={[]} actions={actions}
                                                   filter={{'occurrenceCategory.id': 'http://onto.fel.cvut.cz/ontologies/eccairs-1.3.0.8/V-24-430-1'}}/>),
            message = Environment.getComponentByTagAndText(result, 'div', en.messages['reports.filter.no-matching-found']);

        expect(message).not.toBeNull();
    });

    it('shows message with a link to dashboard when no reports exist.', function () {
        const result = Environment.render(<Reports allReports={[]} reports={[]} actions={actions}/>),
            message = Environment.getComponentByTagAndText(result, 'div', en.messages['reports.no-reports'] + en.messages['reports.no-reports.link']),
            link = Environment.getComponentByTagAndText(result, 'a', en.messages['reports.no-reports.link']);

        expect(message).not.toBeNull();
        expect(link).not.toBeNull();
    });
});
