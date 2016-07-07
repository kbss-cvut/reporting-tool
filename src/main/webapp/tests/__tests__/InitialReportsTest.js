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

describe('InitialReports component tests', function () {

    var React = require('react'),
        ReactDOM = require('react-dom'),
        TestUtils = require('react-addons-test-utils'),
        Environment = require('../environment/Environment'),
        InitialReports = require('../../js/components/initialreport/InitialReports');

    it('Opens initial report add dialog on Add button click', function () {
        var reports = Environment.render(<InitialReports report={{}} onAttributeChange={function() {}}/>);
        var addButton = ReactDOM.findDOMNode(reports.refs.addInitialReport);
        var wizard = reports.refs.initialReportWizard;
        expect(wizard.props.show).toBeFalsy();
        TestUtils.Simulate.click(addButton);
        expect(wizard.props.show).toBeTruthy();
    });

    it('Adds new initial report when wizard is submitted', function () {
        var callbacks = jasmine.createSpyObj('callbacks', ['onAttributeChange', 'onClose']);
        var reports = Environment.render(<InitialReports report={{initialReports: []}}
                                                         onAttributeChange={callbacks.onAttributeChange}/>),
            initialReportText = 'Test',
            initialReport = {text: initialReportText};

        reports.saveNewInitialReport({data: {initialReport: initialReport}}, callbacks.onClose);
        expect(callbacks.onAttributeChange).toHaveBeenCalledWith('initialReports', [initialReport]);
        expect(callbacks.onClose).toHaveBeenCalled();
    });

    it('Updates initial reports when editing one is finished', function () {
        var callbacks = jasmine.createSpyObj('callbacks', ['onAttributeChange', 'onClose']);
        var initialReports = [{text: 'Initial text'}];
        var reports = Environment.render(<InitialReports report={{initialReports: initialReports}}
                                                         onAttributeChange={callbacks.onAttributeChange}/>),
            updatedText = 'Updated text',
            initialReport = {text: updatedText};
        reports.state.editedInitialReportIndex = 0;
        reports.saveInitialReport({data: {initialReport: initialReport}}, callbacks.onClose);
        expect(callbacks.onAttributeChange).toHaveBeenCalledWith('initialReports', [initialReport]);
        expect(callbacks.onClose).toHaveBeenCalled();
    });
});
