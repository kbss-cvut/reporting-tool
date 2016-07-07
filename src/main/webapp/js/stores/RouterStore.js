'use strict';

var Reflux = require('reflux');

/**
 * Manages passing payloads on routing transition.
 *
 * For example, when one wants to pass and object when transitioning to another route, this store will be used to store
 * the payload object and the target route handler can ask for it.
 */
var RouterStore = Reflux.createStore({

    transitionPayload: {},
    viewHandlers: {},

    setTransitionPayload: function (routeName, payload) {
        if (!payload) {
            delete this.transitionPayload[routeName];
        } else {
            this.transitionPayload[routeName] = payload;
        }
    },

    /**
     * Gets the specified route's payload, if there is any.
     * @param routeName Route name
     * @return {*} Route transition payload or null if there is none for the specified routeName
     */
    getTransitionPayload: function (routeName) {
        return this.transitionPayload[routeName];
    },

    setViewHandlers: function (routeName, handlers) {
        if (!handlers) {
            delete this.viewHandlers[routeName];
        } else {
            this.viewHandlers[routeName] = handlers;
        }
    },

    getViewHandlers: function (routeName) {
        return this.viewHandlers[routeName];
    }
});

module.exports = RouterStore;
