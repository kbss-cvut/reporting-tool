'use strict';

var Reflux = require('reflux');

var Actions = require('../actions/Actions');

var MessageStore = Reflux.createStore({
    init: function () {
        this.listenTo(Actions.publishMessage, this.onPublishMessage);
    },

    /**
     * Publishes the specified message to everyone who's listening to this store.
     * @param msg The message to show
     * @param msgType Message type, e.g. success, warning, error. See Constants
     * @param source Message source, preferably an action or a component
     */
    onPublishMessage: function (msg, msgType, source) {
        this.trigger({
            message: msg,
            type: msgType,
            source: source
        });
    }
});

module.exports = MessageStore;
