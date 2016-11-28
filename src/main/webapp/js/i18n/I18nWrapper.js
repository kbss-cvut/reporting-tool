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

import React from "react";

// ES6 Higher Order Component (HOC) which wraps a component and passes to it the i18n utility function
const I18nWrapper = (Component) => class extends React.Component {
    constructor(props) {
        super(props);
    }

    i18n = (id) => {
        return this.props.intl.messages[id];
    };

    formatMessage = (messageId, values) => {
        return this.props.intl.formatMessage({id: messageId}, values);
    };

    getWrappedComponent() {
        return this._wrappedComponent;
    }

    render() {
        return <Component ref={(c) => this._wrappedComponent = c} i18n={this.i18n}
                          formatMessage={this.formatMessage} {...this.props}/>;
    }
};

export default I18nWrapper;
