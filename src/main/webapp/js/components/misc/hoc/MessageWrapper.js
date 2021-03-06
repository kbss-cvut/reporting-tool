/*
 * Copyright (C) 2017 Czech Technical University in Prague
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
                },
                message = this.state.message;
            return React.createElement(tag, null,
                <Component ref={(c) => this._wrappedComponent = c}
                           messageDisplayed={message !== null} {...methods} {...this.props}/>,
                message !== null && <div className='message-container'>
                    <Alert bsStyle={message.type} onDismiss={this._dismissMessage}>
                        <p>{message.text}</p>
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
