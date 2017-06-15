'use strict';

/**
 * Internationalization store for access from non-react components and objects.
 */

var _messages = [];
var _intl = {};

var I18nStore = {

    setMessages: function (messages) {
        _messages = messages;
    },

    setIntl: function (intl) {
        _intl = intl;
    },

    i18n: function (messageId) {
        return _messages[messageId];
    },

    getIntl: function () {
        return _intl;
    }
};

module.exports = I18nStore;
