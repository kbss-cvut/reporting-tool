'use strict';

var I18nMixin = {

    i18n: function (id) {
        return this.props.intl.messages[id];
    }
};

module.exports = I18nMixin;
