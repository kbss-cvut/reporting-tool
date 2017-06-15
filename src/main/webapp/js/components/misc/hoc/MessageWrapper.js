'use strict';

import React from "react";
import {Alert} from "react-bootstrap";
import Constants from "../../../constants/Constants";
import getDisplayName from "../../../utils/getDisplayName";

/**
 * Decorates the specified component with the ability to display messages.
 * @param Component The component to decorate
 * @param options Options, allow to specify in what element all should be wrapped. It is a 'div' by default.
 */
const MessageWrapper = (Component, options) => {
    class Wrapped extends React.Component {
        constructor(props) {
            super(props);
            this.dismissInterval = Constants.MESSAGE_DURATION;
            this.state = {
                message: null
            };
            this.wrappedComponent = Component.wrappedComponent ? Component.wrappedComponent : Component;
        }

        componentWillUnmount() {
            if (this.messageTimeout) {
                clearTimeout(this.messageTimeout);
            }
        }

        getWrappedComponent() {
            // Enable composition of multiple HOCs.
            return this._wrappedComponent && this._wrappedComponent.getWrappedComponent ?
                this._wrappedComponent.getWrappedComponent() : this._wrappedComponent;
        }

        _dismissMessage = () => {
            this.setState({message: null});
            this.messageTimeout = null;
        };

        showInfoMessage = (text, interval = Constants.MESSAGE_DURATION) => {
            this.dismissInterval = interval;
            this._showMessage(Constants.MESSAGE_TYPE.INFO, text);
        };

        _showMessage(type, text) {
            this.setState({
                message: {
                    type: type,
                    text: text
                }
            });
            this.messageTimeout = setTimeout(() => this._dismissMessage(), this.dismissInterval);
        }

        showSuccessMessage = (text, interval = Constants.MESSAGE_DURATION) => {
            this.dismissInterval = interval;
            this._showMessage(Constants.MESSAGE_TYPE.SUCCESS, text);
        };

        showErrorMessage = (text, interval = Constants.MESSAGE_DURATION) => {
            this.dismissInterval = interval;
            this._showMessage(Constants.MESSAGE_TYPE.ERROR, text);
        };

        showWarnMessage = (text, interval = Constants.MESSAGE_DURATION) => {
            this.dismissInterval = interval;
            this._showMessage(Constants.MESSAGE_TYPE.WARNING, text);
        };

        showMessage = (text, msgType, interval = Constants.MESSAGE_DURATION) => {
            this.dismissInterval = interval;
            this._showMessage(msgType, text);
        };

        render() {
            const tag = options && options.tag ? options.tag : 'div',
                methods = {
                    showInfoMessage: this.showInfoMessage,
                    showSuccessMessage: this.showSuccessMessage,
                    showErrorMessage: this.showErrorMessage,
                    showWarnMessage: this.showWarnMessage,
                    showMessage: this.showMessage
                };
            return React.createElement(tag, null,
                <Component ref={(c) => this._wrappedComponent = c} {...methods} {...this.props}/>,
                this.state.message && <div className='message-container'>
                    <Alert bsStyle={this.state.message.type} onDismiss={this._dismissMessage}>
                        <p>{this.state.message.text}</p>
                    </Alert>
                </div>
            );
        }
    }
    Wrapped.displayName = "MessageWrapper(" + getDisplayName(Component) + ")";
    Wrapped.WrappedComponent = Component.WrappedComponent ? Component.WrappedComponent : Component;
    return Wrapped;
};

export default MessageWrapper;
