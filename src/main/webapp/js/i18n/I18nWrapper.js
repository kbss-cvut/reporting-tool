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
