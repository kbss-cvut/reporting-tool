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

describe('Report store', function () {

    var rewire = require('rewire'),
        Environment = require('../environment/Environment'),
        Actions = require('../../js/actions/Actions'),
        Ajax = rewire('../../js/utils/Ajax'),
        ReportStore = rewire('../../js/stores/ReportStore'),
        reqMockMethods = ['get', 'put', 'post', 'del', 'send', 'accept', 'set', 'end'],
        reqMock;

    beforeEach(function () {
        reqMock = Environment.mockRequestMethods(reqMockMethods);
        Ajax.__set__('request', reqMock);
        Ajax.__set__('Logger', Environment.mockLogger());
        ReportStore.__set__('Ajax', Ajax);
        jasmine.getGlobal().top = {};
    });

    it('triggers with data and action identification when reports are loaded', function () {
        var reports = [
            {id: 'reportOne'},
            {id: 'reportTwo'}
        ];
        spyOn(ReportStore, 'trigger').and.callThrough();
        reqMock.end.and.callFake(function (handler) {
            handler(null, {
                body: reports
            });
        });
        ReportStore.onLoadAllReports();

        expect(ReportStore.trigger).toHaveBeenCalledWith({
            action: Actions.loadAllReports,
            reports: reports
        });
    });

    it('triggers with empty reports when an ajax error occurs', function () {
        spyOn(ReportStore, 'trigger').and.callThrough();
        reqMock.end.and.callFake(function (handler) {
            var err = {
                status: 400,
                response: {
                    text: '{"message": "Error message." }',
                    req: {
                        method: 'GET'
                    }
                }
            };
            handler(err, null);
        });
        ReportStore.onLoadAllReports();

        expect(ReportStore.trigger).toHaveBeenCalledWith({
            action: Actions.loadAllReports,
            reports: []
        });
    });

    it('triggers with data and action when report is loaded', function () {
        var report = {id: 'reportOne'};
        spyOn(ReportStore, 'trigger').and.callThrough();
        reqMock.end.and.callFake(function (handler) {
            handler(null, {
                body: report
            });
        });
        ReportStore.onLoadReport();

        expect(ReportStore.trigger).toHaveBeenCalledWith({
            action: Actions.loadReport,
            report: report
        });
    });

    it('triggers with null report when ajax error occurs', function () {
        spyOn(ReportStore, 'trigger').and.callThrough();
        reqMock.end.and.callFake(function (handler) {
            var err = {
                status: 404,
                response: {
                    text: '{"message": "Report not found." }',
                    req: {
                        method: 'GET'
                    }
                }
            };
            handler(err, null);
        });
        ReportStore.onLoadReport();

        expect(ReportStore.trigger).toHaveBeenCalledWith({
            action: Actions.loadReport,
            report: null
        });
    });

    it('does not start new request when loadAllReports is triggered and reports are already being loaded', () => {
        var reports = [
            {id: 'reportOne'},
            {id: 'reportTwo'}
        ];
        reqMock.end.and.callFake(function (handler) {
            setTimeout(() => {
                handler(null, {
                    body: reports
                });
            }, 500);

        });
        ReportStore.onLoadAllReports();
        ReportStore.onLoadAllReports();

        expect(reqMock.end.calls.count()).toEqual(1);
    });
});
