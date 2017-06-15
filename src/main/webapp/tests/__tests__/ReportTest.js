'use strict';

describe('Report', function () {

    const React = require('react'),
        TestUtils = require('react-addons-test-utils'),
        Environment = require('../environment/Environment'),
        Report = require('../../js/components/report/Report').default,
        ResourceNotFound = require('../../js/components/ResourceNotFound');

    it('shows not found error when report is not found', function () {
        const rendered = Environment.render(<Report loading={false} report={null}/>),
            notFoundError = TestUtils.findRenderedComponentWithType(rendered, ResourceNotFound);
        expect(notFoundError).not.toBeNull();
    });
});