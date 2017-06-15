'use strict';

const Reflux = require('reflux');

/**
 * Manages passing payloads on routing transition.
 *
 * For example, when one wants to pass and object when transitioning to another route, this store will be used to store
 * the payload object and the target route handler can ask for it.
 */
const RouterStore = Reflux.createStore({

    transitionPayload: {},
    viewHandlers: {},

    setTransitionPayload: function (routeName, payload) {
        if (!payload) {
            this.clearTransitionPayload(routeName);
        } else {
            this.transitionPayload[routeName] = payload;
        }
    },

    clearTransitionPayload(routeName) {
        delete this.transitionPayload[routeName];
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
