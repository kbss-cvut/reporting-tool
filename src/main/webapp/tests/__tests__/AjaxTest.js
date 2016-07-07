'use strict';

describe('Ajax utility', function () {

    var rewire = require('rewire'),
        Ajax = rewire('../../js/utils/Ajax'),
        Routes = require('../../js/utils/Routes'),
        Environment = require('../environment/Environment'),
        reqMock, RoutingMock, UtilsMock,
        reqMockMethods = ['get', 'put', 'post', 'del', 'send', 'accept', 'set', 'end'];

    beforeEach(function () {
        // We need only the 'end' function
        reqMock = Environment.mockRequestMethods(reqMockMethods);
        RoutingMock = jasmine.createSpyObj('Routing', ['transitionTo', 'transitionToHome', 'saveOriginalTarget']);
        // Just prevent log messages in test output
        UtilsMock = jasmine.createSpyObj('Utils', ['getPathFromLocation']);
        Ajax.__set__('request', reqMock);
        Ajax.__set__('Routing', RoutingMock);
        Ajax.__set__('Logger', Environment.mockLogger());
        Ajax.__set__('Utils', UtilsMock);
        jasmine.getGlobal().top = {};
    });

    it('transitions to login screen when 401 status is returned', function () {
        reqMock.end.and.callFake(function (fn) {
            var err = {
                status: 401
            };
            fn(err, {});
        });
        UtilsMock.getPathFromLocation.and.returnValue('reports');
        Ajax.get('rest/reports').end();

        expect(reqMock.end).toHaveBeenCalled();
        expect(RoutingMock.transitionTo).toHaveBeenCalledWith(Routes.login);
    });

    it('saves original target route before transitioning to login when 401 status is returned', function () {
        var path = Routes.reports.path;
        reqMock.end.and.callFake(function (fn) {
            var err = {
                status: 401
            };
            fn(err, {});
        });
        UtilsMock.getPathFromLocation.and.returnValue(path);

        Ajax.get('rest/reports').end();

        expect(RoutingMock.saveOriginalTarget).toHaveBeenCalledWith({path: path});
        expect(RoutingMock.transitionTo).toHaveBeenCalledWith(Routes.login);
    });

    it('does not transition anywhere when the user is on register or login screen', function () {
        var path = Routes.login.path;
        reqMock.end.and.callFake(function (fn) {
            var err = {
                status: 401
            };
            fn(err, {});
        });
        UtilsMock.getPathFromLocation.and.returnValue(path);

        Ajax.get('rest/users/current').end();
        expect(RoutingMock.saveOriginalTarget).not.toHaveBeenCalled();
        expect(RoutingMock.transitionTo).not.toHaveBeenCalled();

        path = Routes.register.path;
        UtilsMock.getPathFromLocation.and.returnValue(path);

        Ajax.get('rest/users/current').end();
        expect(RoutingMock.saveOriginalTarget).not.toHaveBeenCalled();
        expect(RoutingMock.transitionTo).not.toHaveBeenCalled();
    });

    it('calls success handler when it is defined and success response is returned', function () {
        var resp = {
                status: 200,
                body: {
                    uri: 'http://someUri',
                    key: '12345'
                }
            },
            successHandler = jasmine.createSpy('successHandler');
        reqMock.end.and.callFake(function (fn) {
            fn(null, resp);
        });

        Ajax.get('rest/reports').end(successHandler);

        expect(successHandler).toHaveBeenCalledWith(resp.body, resp);
    });

    it('does nothing when no success handler is passed and success response is returned', function () {
        var resp = {
            status: 204
        };
        reqMock.end.and.callFake(function (fn) {
            fn(null, resp);
        });
        spyOn(Ajax, '_handleError');

        Ajax.del('rest/reports').end();

        expect(Ajax._handleError).not.toHaveBeenCalled();
    });

    it('calls error handler when it is defined and error response is returned', function () {
        var err = {
                status: 404,
                response: {
                    text: JSON.stringify({message: 'Resource not found'})
                }
            }, resp = {
                status: 404
            },
            successHandler = jasmine.createSpy('successHandler'),
            errorHandler = jasmine.createSpy('errorHandler');
        reqMock.end.and.callFake(function (fn) {
            fn(err, resp);
        });
        spyOn(Ajax, '_handleError');

        Ajax.get('rest/reports/12345').end(null, errorHandler);

        expect(errorHandler).toHaveBeenCalledWith(JSON.parse(err.response.text), err);
        expect(successHandler).not.toHaveBeenCalled();
    });

    it('logs error when no error handler is defined and error response is returned', function () {
        var err = {
                status: 404,
                response: {
                    text: JSON.stringify({message: 'Resource not found', requestUri: 'rest/reports/12345'}),
                    req: {
                        method: 'GET'
                    }
                }
            }, resp = {
                status: 404
            },
            successHandler = jasmine.createSpy('successHandler');
        reqMock.end.and.callFake(function (fn) {
            fn(err, resp);
        });
        spyOn(Ajax, '_handleError').and.callThrough();

        Ajax.get('rest/reports/12345').end(successHandler);

        expect(Ajax._handleError).toHaveBeenCalledWith(err);
        expect(successHandler).not.toHaveBeenCalled();
    });

    it('extends portal session when the application is running on Liferay', () => {
        var top = {
            Liferay: {
                Session: {}
            }
        }, extend = jasmine.createSpy('extend'), successHandler = jasmine.createSpy('successHandler');
        top.Liferay.Session.extend = extend;
        jasmine.getGlobal().top = top;

        Ajax.get('rest/reports').end(successHandler);
        expect(extend).toHaveBeenCalled();
    });
});
