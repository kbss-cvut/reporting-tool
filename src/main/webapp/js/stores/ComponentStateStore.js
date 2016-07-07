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
var assign = require('object-assign');

var Actions = require('../actions/Actions');

/**
 * Stores state of components.
 *
 * Useful for example when a component is going to be dismounted, but we want to remember (a part of) its state for the
 * next time it is rendered.
 */
var ComponentStateStore = Reflux.createStore({

    init: function () {
        this.listenTo(Actions.rememberComponentState, this.onRememberComponentState);
        this.listenTo(Actions.resetComponentState, this.onResetComponentState);
    },

    _states: {},


    onRememberComponentState: function (compId, state) {
        this._states[compId] = assign({}, state);
    },

    onResetComponentState: function (compId) {
        delete this._states[compId];
    },

    /**
     * Gets state remembered for the specified component.
     * @param compId Component identifier
     * @return {*} The stored state or null, if non has been stored
     */
    getComponentState: function (compId) {
        return this._states[compId];
    }
});

module.exports = ComponentStateStore;
