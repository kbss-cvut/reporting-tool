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
