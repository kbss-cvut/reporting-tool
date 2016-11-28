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

const React = require('react');
const Alert = require('react-bootstrap').Alert;


const MessageMixin = {
    getInitialState: function () {
        return {
            message: null
        };
    },

    dismissInterval: 5000,

    dismissMessage: function () {
        this.setState({message: null});
        this.messageTimeout = null;
    },

    showInfoMessage: function (text) {
        this.dismissInterval = 10000;
        this._showMessage('info', text);
    },

    _showMessage: function (type, text) {
        this.setState({
            message: {
                type: type,
                text: text
            }
        });
        this.messageTimeout = setTimeout(() => this.dismissMessage(), this.dismissInterval);
    },

    showSuccessMessage: function (text) {
        this.dismissInterval = 10000;
        this._showMessage('success', text);
    },

    showErrorMessage: function (text) {
        this.dismissInterval = 10000;
        this._showMessage('danger', text);
    },

    showWarnMessage: function (text) {
        this.dismissInterval = 10000;
        this._showMessage('warning', text);
    },

    renderMessage: function () {
        return this.state.message ? <div className='message-container'>
            <Alert bsStyle={this.state.message.type} onDismiss={this.dismissMessage}>
                <p>{this.state.message.text}</p>
            </Alert>
        </div> : null;
    },

    cleanupMessages: function () {
        if (this.messageTimeout) {
            clearTimeout(this.messageTimeout);
        }
    }
};

module.exports = MessageMixin;
