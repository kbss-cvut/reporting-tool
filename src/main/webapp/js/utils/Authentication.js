'use strict';

var Actions = require('../actions/Actions');
var Ajax = require('./Ajax');
var Routes = require('./Routes');
var Routing = require('./Routing');
var Logger = require('./Logger');

var Authentication = {

    login: function (username, password, errorCallback) {
        Ajax.post('j_spring_security_check', null, 'form')
            .send('username=' + username).send('password=' + password)
            .end(function (err, resp) {
                if (err) {
                    errorCallback();
                    return;
                }
                var status = JSON.parse(resp.text);
                if (!status.success || !status.loggedIn) {
                    errorCallback();
                    return;
                }
                Actions.loadUser();
                Logger.log('User successfully authenticated.');
                Routing.transitionToOriginalTarget();
            }.bind(this));
    },

    logout: function () {
        Ajax.post('j_spring_security_logout').end(function (err) {
            if (err) {
                Logger.error('Logout failed. Status: ' + err.status);
            } else {
                Logger.log('User successfully logged out.');
            }
            Routing.transitionTo(Routes.login);
            window.location.reload();
        });
    }
};

module.exports = Authentication;
