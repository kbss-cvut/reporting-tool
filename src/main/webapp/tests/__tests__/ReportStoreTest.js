'use strict';

describe('Report store', function () {

    const rewire = require('rewire'),
        Environment = require('../environment/Environment'),
        Actions = require('../../js/actions/Actions'),
        Ajax = rewire('../../js/utils/Ajax'),
        Generator = require('../environment/Generator').default,
        ReportStore = rewire('../../js/stores/ReportStore'),
        Vocabulary = require('../../js/constants/Vocabulary'),
        reqMockMethods = ['get', 'put', 'post', 'del', 'send', 'accept', 'set', 'type', 'end'];
    let reqMock, reports;

    beforeEach(function () {
        reqMock = Environment.mockRequestMethods(reqMockMethods);
        Ajax.__set__('request', reqMock);
        Ajax.__set__('Logger', Environment.mockLogger());
        ReportStore.__set__('Ajax', Ajax);
        jasmine.getGlobal().top = {};
        ReportStore.__set__('reportsLoading', false);
        ReportStore._reports = null;
        reports = Generator.generateReports();
        if (reports.length > 5) {
            reports = reports.slice(0, 5);
        }
    });

    it('triggers with data and action identification when reports are loaded', function () {
        spyOn(ReportStore, 'trigger').and.callThrough();
        mockResponse(null, reports);
        ReportStore.onLoadAllReports();

        expect(ReportStore.trigger).toHaveBeenCalledWith({
            action: Actions.loadAllReports,
            reports: reports
        });
    });

    function mockResponse(err, body) {
        reqMock.end.and.callFake(function (handler) {
            handler(err, {
                body: body
            });
        });
    }

    it('triggers with empty reports when an ajax error occurs', function () {
        spyOn(ReportStore, 'trigger').and.callThrough();
        mockResponse({
            status: 400,
            response: {
                text: '{"message": "Error message." }',
                req: {
                    method: 'GET'
                }
            }
        }, null);
        ReportStore.onLoadAllReports();

        expect(ReportStore.trigger).toHaveBeenCalledWith({
            action: Actions.loadAllReports,
            reports: []
        });
    });

    it('triggers with data and action when report is loaded', function () {
        const report = {id: 'reportOne'};
        spyOn(ReportStore, 'trigger').and.callThrough();
        mockResponse(null, report);
        ReportStore.onLoadReport();

        expect(ReportStore.trigger).toHaveBeenCalledWith({
            action: Actions.loadReport,
            report: report
        });
    });

    it('triggers with null report when ajax error occurs', function () {
        spyOn(ReportStore, 'trigger').and.callThrough();
        mockResponse({
            status: 404,
            response: {
                text: '{"message": "Report not found." }',
                req: {
                    method: 'GET'
                }
            }
        }, null);
        ReportStore.onLoadReport();

        expect(ReportStore.trigger).toHaveBeenCalledWith({
            action: Actions.loadReport,
            report: null
        });
    });

    it('does not start new request when loadAllReports is triggered and reports are already being loaded', () => {
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

    it('passes report keys as query params when they are specified', () => {
        const keys = [];
        for (let i = 0, cnt = Generator.getRandomPositiveInt(1, 5); i < cnt; i++) {
            keys.push(Generator.getRandomInt().toString());
        }
        spyOn(Ajax, 'get').and.callThrough();
        ReportStore.onLoadAllReports(keys);

        expect(Ajax.get).toHaveBeenCalled();
        const url = Ajax.get.calls.argsFor(0)[0];
        keys.forEach(key => {
            expect(url.indexOf('key=' + key)).not.toEqual(-1);
        });
    });

    it('sets search reports to the loaded reports when keys were not specified', () => {
        mockResponse(null, reports);
        spyOn(ReportStore, 'trigger');
        ReportStore.onLoadAllReports();
        expect(ReportStore._reports).toEqual(reports);
        expect(ReportStore._searchReports).toEqual(ReportStore._reports);
        expect(ReportStore.trigger).toHaveBeenCalledWith({action: Actions.loadReportsForSearch, reports: reports});
    });

    it('sets isNew attribute for reports created by initial report import', () => {
        const report = {
            initialReport: {
                description: 'Blabla'
            }
        }, onSuccess = jasmine.createSpy('onSuccess');
        mockResponse(null, report);
        ReportStore.onImportInitialReport(report, onSuccess);
        expect(onSuccess).toHaveBeenCalled();
        const newReport = onSuccess.calls.argsFor(0)[0];
        expect(newReport.isNew).toBeTruthy();
    });

    it('resolves JSON references of imported initial report', () => {
        const report = {
            initialReport: {
                description: 'Blabla'
            },
            occurrence: {
                referenceId: 1
            },
            factorGraph: {
                nodes: [1, {
                    referenceId: 2
                }],
                edges: [{
                    from: 1,
                    to: 2,
                    linkType: Vocabulary.HAS_PART
                }]
            }
        }, onSuccess = jasmine.createSpy('onSuccess');
        mockResponse(null, report);
        ReportStore.onImportInitialReport(report, onSuccess);
        expect(onSuccess).toHaveBeenCalled();
        const newReport = onSuccess.calls.argsFor(0)[0];
        expect(newReport.factorGraph.edges[0].from).toEqual(newReport.occurrence);
        expect(newReport.factorGraph.edges[0].to).toEqual(newReport.factorGraph.nodes[1]);
    });

    describe('load reports for search', () => {

        it('reuses all reports when they are already loaded and were not filtered', () => {
            ReportStore._reports = reports;
            spyOn(ReportStore, 'trigger');
            spyOn(Ajax, 'get').and.callThrough();
            ReportStore.onLoadReportsForSearch();
            expect(ReportStore._searchReports).toEqual(ReportStore._reports);
            expect(ReportStore.trigger).toHaveBeenCalledWith({action: Actions.loadReportsForSearch, reports: reports});
            expect(Ajax.get).not.toHaveBeenCalled();
        });

        it('loads reports from server when the already loaded all reports were filtered', () => {
            ReportStore._reports = [{reportKey: '123'}];
            ReportStore.__set__('lastLoadWithKeys', true);
            mockResponse(null, reports);
            spyOn(ReportStore, 'trigger');
            spyOn(Ajax, 'get').and.callThrough();
            ReportStore.onLoadReportsForSearch();
            expect(Ajax.get).toHaveBeenCalled();
            expect(ReportStore.trigger).toHaveBeenCalledWith({action: Actions.loadReportsForSearch, reports: reports});
        });

        it('loads reports from server when there are no already loaded reports', () => {
            ReportStore.__set__('lastLoadWithKeys', false);
            mockResponse(null, reports);
            spyOn(ReportStore, 'trigger');
            spyOn(Ajax, 'get').and.callThrough();
            ReportStore.onLoadReportsForSearch();
            expect(Ajax.get).toHaveBeenCalled();
            expect(ReportStore.trigger).toHaveBeenCalledWith({action: Actions.loadReportsForSearch, reports: reports});
        });

        it('loads reports from server when the reports being loaded are filtered', () => {
            ReportStore.__set__('lastLoadWithKeys', true);
            ReportStore.__set__('reportsLoading', true);
            mockResponse(null, reports);
            spyOn(ReportStore, 'trigger');
            spyOn(Ajax, 'get').and.callThrough();
            ReportStore.onLoadReportsForSearch();
            expect(Ajax.get).toHaveBeenCalled();
            expect(ReportStore.trigger).toHaveBeenCalledWith({action: Actions.loadReportsForSearch, reports: reports});
        });

        it('waits for all reports to be loaded when they are not filtered', () => {
            ReportStore.__set__('lastLoadWithKeys', false);
            ReportStore.__set__('reportsLoading', true);
            spyOn(ReportStore, 'trigger');
            spyOn(Ajax, 'get').and.callThrough();
            ReportStore.onLoadReportsForSearch();
            expect(Ajax.get).not.toHaveBeenCalled();
        });
    });
});
