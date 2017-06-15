'use strict';

import React from "react";
import getDisplayName from "../utils/getDisplayName";

// ES6 Higher Order Component (HOC) which wraps a component and passes to it the i18n utility function
const I18nWrapper = (Component) => {
    class Wrapped extends React.Component {
        constructor(props) {
            super(props);
            this.WrappedComponent = Component.WrappedComponent ? Component.WrappedComponent : Component;
            this.displayName = 'I18nWrapper';
        }

        i18n = (id) => {
            return this.props.intl.messages[id];
        };

        formatMessage = (messageId, values) => {
            return this.props.intl.formatMessage({id: messageId}, values);
        };

        getWrappedComponent() {
            // Enable composition of multiple HOCs.
            return this._wrappedComponent && this._wrappedComponent.getWrappedComponent ?
                this._wrappedComponent.getWrappedComponent() : this._wrappedComponent;
        }

        render() {
            return <Component ref={(c) => this._wrappedComponent = c} i18n={this.i18n}
                              formatMessage={this.formatMessage} {...this.props}/>;
        }
    }
    Wrapped.displayName = "I18nWrapper(" + getDisplayName(Component) + ")";
    Wrapped.WrappedComponent = Component.WrappedComponent ? Component.WrappedComponent : Component;
    return Wrapped;
};


export default I18nWrapper;
