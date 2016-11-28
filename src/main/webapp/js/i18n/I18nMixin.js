'use strict';

var I18nMixin = {

    i18n: function (id) {
        return this.props.intl.messages[id];
    },

    formatMessage: function (messageId, values) {
        return this.props.intl.formatMessage({id: messageId}, values);
    }
};

module.exports = I18nMixin;
