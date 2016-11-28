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

describe('Occurrence report controller', function () {

    var React = require('react'),
        Button = require('react-bootstrap').Button,
        rewire = require('rewire'),
        Environment = require('../environment/Environment'),
        Generator = require('../environment/Generator').default,
        ReportController = rewire('../../js/components/report/occurrence/OccurrenceReportController'),
        OccurrenceReport = rewire('../../js/components/report/occurrence/OccurrenceReport'),
        Actions = require('../../js/actions/Actions');

    beforeEach(function () {
        spyOn(Actions, 'loadOptions');
        Environment.mockFactors(OccurrenceReport);
        ReportController.__set__('ReportDetail', OccurrenceReport);
    });

    it('shows only Cancel button if the displayed report is not the latest revision.', function () {
        var report = Generator.generateOccurrenceReport(),
            revisions = [
                {
                    revision: 2,
                    key: 54321
                },
                {
                    revision: report.revision,
                    key: report.key
                }
            ],
            expectedButtons = ['Cancel'],
            hiddenButtons = ['Save', 'Submit to authority'],
            i, len;
        spyOn(Actions, 'loadReport');
        spyOn(Actions, 'loadRevisions');
        var result = Environment.render(<ReportController report={report} revisions={revisions}/>);

        for (i = 0, len = expectedButtons.length; i < len; i++) {
            expect(getButton(result, expectedButtons[i])).not.toBeNull();
        }
        for (i = 0, len = hiddenButtons.length; i < len; i++) {
            expect(getButton(result, hiddenButtons[i])).toBeNull();
        }
    });

    function getButton(root, text) {
        return Environment.getComponentByText(root, Button, text);
    }

    it('updates report state when onChange is called.', function () {
        var report = Generator.generateOccurrenceReport(),
            newSummary = 'New investigation summary.';
        spyOn(Actions, 'loadReport');
        spyOn(Actions, 'loadRevisions');
        var result = Environment.render(<ReportController report={report}/>);

        result.onChange({summary: newSummary});
        expect(result.state.report.summary).toEqual(newSummary);
    });

    it('calls loadReport when revision is selected.', function () {
        var report = Generator.generateOccurrenceReport(),
            selectedRevision = {revision: 2, key: '111222333'};
        spyOn(Actions, 'loadReport');
        spyOn(Actions, 'loadRevisions');
        var result = Environment.render(<ReportController report={report}/>);
        spyOn(result, 'loadReport');

        result.onRevisionSelected(selectedRevision);
        expect(result.loadReport).toHaveBeenCalledWith(selectedRevision.key);
    });

    it('reloads report on save success.', function () {
        var report = Generator.generateOccurrenceReport();
        spyOn(Actions, 'loadReport');
        var result = Environment.render(<ReportController report={report}/>);

        result.onSuccess();
        expect(Actions.loadReport).toHaveBeenCalled();
    });
});
