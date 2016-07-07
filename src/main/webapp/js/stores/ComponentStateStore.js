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
