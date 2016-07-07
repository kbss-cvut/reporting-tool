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
/**
 * @jsx
 */
'use strict';

var React = require('react');
var Alert = require('react-bootstrap').Alert;


var MessageMixin = {
    getInitialState: function () {
        return {
            message: null
        };
    },

    dismissInterval: 5000,

    dismissMessage: function () {
        this.setState({message: null});
    },

    showInfoMessage: function (text) {
        this.dismissInterval = 5000;
        this._showMessage('info', text);
    },

    _showMessage: function (type, text) {
        this.setState({
            message: {
                type: type,
                text: text
            }
        });
    },

    showSuccessMessage: function (text) {
        this.dismissInterval = 5000;
        this._showMessage('success', text);
    },

    showErrorMessage: function (text) {
        this.dismissInterval = 10000;
        this._showMessage('danger', text);
    },

    renderMessage: function () {
        return this.state.message ? (
            <div className='form-group'>
                <Alert bsStyle={this.state.message.type} onDismiss={this.dismissMessage}
                       dismissAfter={this.dismissInterval}>
                    <p>{this.state.message.text}</p>
                </Alert>
            </div>
        ) : null;
    }
};

module.exports = MessageMixin;
