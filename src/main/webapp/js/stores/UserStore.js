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
