/*
 * Copyright (C) 2017 Czech Technical University in Prague
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

const Reflux = require('reflux');

const Actions = require('../actions/Actions');
const Ajax = require('../utils/Ajax');
const Constants = require('../constants/Constants');

const BASE_URL = Constants.REST_PREFIX + 'persons';

let currentUser = null;
let loaded = false;

function loadCurrentUser() {
    Ajax.get(BASE_URL + '/current').end(UserStore.userLoaded);
}

const UserStore = Reflux.createStore({
    listenables: [Actions],

    onLoadUsers: function () {
        Ajax.get(BASE_URL).end((data) => {
            this.trigger({
                action: Actions.loadUsers,
                users: data
            });
        }, () => {
            this.trigger({
                action: Actions.loadUsers,
                users: []
            });
        });
    },

    onLoadUser: function () {
        loadCurrentUser();
    },

    userLoaded: function (user) {
        currentUser = user;
        loaded = true;
        this.trigger({
            action: Actions.loadUser,
            user: this.getCurrentUser()
        });
    },

    getCurrentUser: function () {
        return currentUser;
    },

    isLoaded: function () {
        return loaded;
    },

    onUpdateUser: function (user, onSuccess, onError) {
        Ajax.put(BASE_URL + '/current', user).end(onSuccess, onError);
    },

    onUnlockUser: function (user, newPassword, onSuccess, onError) {
        Ajax.put(BASE_URL + '/unlock?username=' + user.username, newPassword).type('text/plain').end(onSuccess, onError);
    },

    onDisableUser: function (user, onSuccess, onError) {
        Ajax.del(BASE_URL + '/status?username=' + user.username).end(onSuccess, onError);
    },

    onEnableUser: function (user, onSuccess, onError) {
        Ajax.post(BASE_URL + '/status?username=' + user.username).end(onSuccess, onError);
    }
});

module.exports = UserStore;
