'use strict';

const Reflux = require('reflux');

const Actions = require('../actions/Actions');

const MessageStore = Reflux.createStore({
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
