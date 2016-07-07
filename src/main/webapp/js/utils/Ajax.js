'use strict';

var request = require('superagent');
var Cookies = require('js-cookie');

var Routes = require('./Routes');
var Routing = require('./Routing');
var Logger = require('./Logger');
var Utils = require('./Utils');

var csrfTokenHeader = 'X-CSRF-Token';

var Ajax = {
    req: null,

    getCsrfToken: function () {
        var cookie = Cookies.get('CSRF-TOKEN');
        return cookie ? cookie : '';
    },

    get: function (url) {
        this.req = request.get(url, null, null).accept('json');
        return this;
    },

    post: function (url, data, type) {
        this.req = request.post(url).type(type ? type : 'json').accept('json');
        if (data) {
            this.req = this.req.send(data);
        }
        return this;
    },

    attach: function (file) {
        // Remove the content type to force the browser to fill it in for us
        // See http://uncorkedstudios.com/blog/multipartformdata-file-upload-with-angularjs, section Making the
        // multipart/form-data request
        this.req = this.req.attach('file', file, file.name).type(null);
        return this;
    },

    put: function (url, data) {
        this.req = request.put(url).type('json');
        if (data) {
            this.req = this.req.send(data);
        }
        return this;
    },

    del: function (url) {
        this.req = request.del(url);
        return this;
    },

    send: function (data) {
        this.req = this.req.send(data);
        return this;
    },

    /**
     * Executes the previously configured request.
     * @param onSuccess Success handler, it is passed data parsed from the JSON in the response (if present) and the
     *     response itself
     * @param onError Error handler, called when the request returns a non-2xx status. If the error response contains a
     *     parseable JSON object, it is passed to the handler
     */
    end: function (onSuccess, onError) {
        this._extendPortalSession();
        this.req.set(csrfTokenHeader, this.getCsrfToken()).end(function (err, resp) {
            if (err) {
                if (err.status === 401) {
                    var currentRoute = Utils.getPathFromLocation();
                    if (currentRoute !== Routes.register.path && currentRoute !== Routes.login.path) {
                        Routing.saveOriginalTarget({path: currentRoute});
                        Routing.transitionTo(Routes.login);
                    }
                    if (onError) {
                        onError();
                    }
                    return;
                }
                try {
                    if (onError) {
                        onError(JSON.parse(err.response.text), err);
                    }
                    this._handleError(err);
                } catch (ex) {
                    // The response text is not a parseable JSON
                    this._handleError(err);
                }
            } else if (onSuccess) {
                onSuccess(resp.body, resp);
            }
        }.bind(this));
    },

    /**
     * Extends portal session if the application is running on Liferay.
     * @private
     */
    _extendPortalSession: function () {
        if (!top.Liferay) {
            return;
        }
        top.Liferay.Session.extend();
    },

    _handleError: function (err) {
        try {
            var error = JSON.parse(err.response.text),
                method = err.response.req.method,
                msg = method + ' ' + error.requestUri + ' - Status ' + err.status + ': ' + error.message;
            if (err.status === 404) {
                Logger.warn(msg);
            } else {
                Logger.error(msg);
            }
        } catch (ex) {
            Logger.error('AJAX error: ' + err.response.text);
        }
    }
};

module.exports = Ajax;
