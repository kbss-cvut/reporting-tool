'use strict';

var Reflux = require('reflux');

var Actions = require('../actions/Actions');
var Ajax = require('../utils/Ajax');

var currentUser = null;
var loaded = false;

function loadCurrentUser() {
    Ajax.get('rest/persons/current').end(UserStore.userLoaded);
}

var UserStore = Reflux.createStore({
    listenables: [Actions],
    onLoadUser: function () {
        if (currentUser === null) {
            loadCurrentUser();
        }
    },
    userLoaded: function (user) {
        currentUser = user;
        loaded = true;
        this.trigger(this.getCurrentUser());
    },
    getCurrentUser: function () {
        return currentUser;
    },
    isLoaded: function () {
        return loaded;
    }
});

module.exports = UserStore;
