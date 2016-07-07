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
