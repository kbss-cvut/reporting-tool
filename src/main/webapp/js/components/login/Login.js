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
var Panel = require('react-bootstrap').Panel;
var Button = require('react-bootstrap').Button;
var Alert = require('react-bootstrap').Alert;

var injectIntl = require('../../utils/injectIntl');

var Mask = require('../Mask').default;
var Input = require('../Input');
var Routing = require('../../utils/Routing');
var Routes = require('../../utils/Routes');
var Authentication = require('../../utils/Authentication');
var I18nMixin = require('../../i18n/I18nMixin');


var Login = React.createClass({
    mixins: [I18nMixin],

    getInitialState: function () {
        return {
            username: '',
            password: '',
            alertVisible: false,
            mask: false
        }
    },

    componentDidMount: function () {
        this.refs.usernameField.focus();
    },

    onChange: function (e) {
        var state = this.state;
        state[e.target.name] = e.target.value;
        state.alertVisible = false;
        this.setState(state);
    },

    onKeyPress: function (e) {
        if (e.key === 'Enter') {
            this.login();
        }
    },

    onLoginError: function () {
        this.setState({alertVisible: true, mask: false});
    },

    login: function () {
        Authentication.login(this.state.username, this.state.password, this.onLoginError);
        this.setState({mask: true});
    },

    register: function () {
        Routing.transitionTo(Routes.register);
    },


    render: function () {
        var panelCls = this.state.alertVisible ? 'login-panel expanded' : 'login-panel',
            mask = this.state.mask ? (<Mask text={this.i18n('login.progress-mask')}/>) : null;
        return (
            <Panel header={<h3>{this.i18n('login.title')}</h3>} bsStyle='info' className={panelCls}>
                {mask}
                <form className='form-horizontal'>
                    {this.renderAlert()}
                    <Input type='text' name='username' ref='usernameField' label={this.i18n('login.username')}
                           value={this.state.username}
                           onChange={this.onChange} labelClassName='col-xs-3' onKeyPress={this.onKeyPress}
                           wrapperClassName='col-xs-9'/>
                    <Input type='password' name='password' label={this.i18n('login.password')}
                           value={this.state.password}
                           onChange={this.onChange} labelClassName='col-xs-3' onKeyPress={this.onKeyPress}
                           wrapperClassName='col-xs-9'/>

                    <div className='col-xs-3'>&nbsp;</div>
                    <div className='col-xs-9' style={{padding: '0 0 0 7px'}}>
                        <Button bsStyle='success' bsSize='small' onClick={this.login}
                                disabled={this.state.mask}>{this.i18n('login.submit')}</Button>
                        <Button bsStyle='link' bsSize='small' onClick={this.register} style={{padding: '0 0 0 15px'}}
                                disabled={this.state.mask}>{this.i18n('login.register')}</Button>
                    </div>
                </form>
            </Panel>
        )
    },

    renderAlert: function () {
        return this.state.alertVisible ? (
            <Alert bsStyle='danger' bsSize='small'>
                <div>{this.i18n('login.error')}</div>
            </Alert>
        ) : null;
    }
});

module.exports = injectIntl(Login);
