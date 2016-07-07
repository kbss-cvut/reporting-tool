'use strict';

var React = require('react');
var IntlProvider = require('react-intl').IntlProvider;
var en = require('../../js/i18n/en');
var I18nStore = require('../../js/stores/I18nStore');

/**
 * Test application. Used to initialize Intl context by loading the default English localization.
 */
var TestApp = React.createClass({

    componentWillMount: function() {
        I18nStore.setMessages(en.messages);
    },

    render: function () {
        return <IntlProvider {...en}>
            {this.props.children}
        </IntlProvider>
    }
});

module.exports = TestApp;
