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
import PropTypes from "prop-types";
import {Alert, Button, Panel} from "react-bootstrap";
import classNames from "classnames";
import Constants from "../../constants/Constants";
import I18nWrapper from "../../i18n/I18nWrapper";
import injectIntl from "../../utils/injectIntl";
import HorizontalInput from "../HorizontalInput";
import Mask from "../Mask";
import PersonValidator from "../../validation/PersonValidator";

class Register extends React.Component {
    constructor(props) {
        super(props);
        this.i18n = props.i18n;
        this.state = {
            firstName: '',
            lastName: '',
            username: '',
            password: '',
            passwordConfirm: '',
            alertVisible: false,
            errorMessage: '',
            mask: false
        };
    }

    componentWillUnmount() {
        if (this.messageTimeout) {
            clearTimeout(this.messageTimeout);
        }
    }

    onChange = (e) => {
        const change = {};
        change[e.target.name] = e.target.value;
        this.setState(change);
    };

    onKeyDown = (e) => {
        if (e.key === 'Enter') {
            this.register();
        }
    };

    dismissAlert = () => {
        this.setState({alertVisible: false});
    };

    register = () => {
        const userData = {
            firstName: this.state.firstName,
            lastName: this.state.lastName,
            username: this.state.username,
            password: this.state.password,
            passwordConfirm: this.state.passwordConfirm
        };
        if (!PersonValidator.isValid(userData)) {
            return;
        }
        this.props.onRegister(userData, this._onSuccess, this._onError);
    };

    _onSuccess = () => {
        this.setState({mask: false});
    };

    _onError = (msg) => {
        this.setState({mask: false, alertVisible: true, errorMessage: msg});
        this.messageTimeout = setTimeout(() => this.dismissAlert(), Constants.MESSAGE_DURATION);
    };

    render() {
        const panelCls = classNames('register-panel', {'expanded': this.state.alertVisible});
        const mask = this.state.mask ? <Mask text={this.i18n('register.mask')}/> : null;
        return <Panel header={<h3>{this.i18n('register.title')}</h3>} bsStyle='info' className={panelCls}>
            {mask}
            <form className='form-horizontal' style={{margin: '0.5em 0 0 0'}}>
                {this.renderAlert()}
                <div className='row'>
                    <div className='col-xs-6'>
                        <HorizontalInput type='text' name='firstName' label={this.i18n('register.first-name')}
                                         value={this.state.firstName}
                                         labelWidth={4} inputWidth={8} onChange={this.onChange}/>
                    </div>
                    <div className='col-xs-6'>
                        <HorizontalInput type='text' name='lastName' label={this.i18n('register.last-name')}
                                         value={this.state.lastName}
                                         labelWidth={4} inputWidth={8} onChange={this.onChange}/>
                    </div>
                </div>
                <div className='row'>
                    <div className='col-xs-6'>
                        <HorizontalInput type='text' name='username' label={this.i18n('register.username')}
                                         value={this.state.username}
                                         labelWidth={4} inputWidth={8} onChange={this.onChange}/>
                    </div>
                </div>
                <div className='row'>
                    <div className='col-xs-6'>
                        <HorizontalInput type='password' name='password' label={this.i18n('register.password')}
                                         labelWidth={4} inputWidth={8} onChange={this.onChange}
                                         value={this.state.password}/>
                    </div>
                    <div className='col-xs-6'>
                        {this.renderPasswordConfirm()}
                    </div>
                </div>
                <div style={{margin: '1em 0em 0em 0em', textAlign: 'center'}}>
                    <Button bsStyle='success' bsSize='small' ref='submit'
                            disabled={!PersonValidator.isValid(this.state) || this.state.mask}
                            onClick={this.register}>{this.i18n('register.submit')}</Button>
                    <Button bsSize='small' onClick={this.props.onCancel} style={{margin: '0 0 0 3.2em'}}
                            disabled={this.state.mask}>{this.i18n('cancel')}</Button>
                </div>
            </form>
        </Panel>;
    }

    renderAlert() {
        return this.state.alertVisible ? <Alert bsStyle='danger' bsSize='small' onDismiss={this.dismissAlert}>
            <div>{this.state.errorMessage}</div>
        </Alert> : null;
    }

    renderPasswordConfirm() {
        const passMatch = this.state.password === this.state.passwordConfirm;
        if (passMatch) {
            return <HorizontalInput type='password' name='passwordConfirm'
                                    label={this.i18n('register.password-confirm')}
                                    labelWidth={4} inputWidth={8} onChange={this.onChange}
                                    onKeyDown={this.onKeyDown} value={this.state.passwordConfirm}/>;
        } else {
            return <HorizontalInput type='password' name='passwordConfirm'
                                    label={this.i18n('register.password-confirm')}
                                    labelWidth={4} inputWidth={8} onChange={this.onChange}
                                    onKeyDown={this.onKeyDown} value={this.state.passwordConfirm} validation='error'
                                    title={this.i18n('register.passwords-not-matching-tooltip')}/>;
        }
    }
}

Register.propTypes = {
    onRegister: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired
};

export default injectIntl(I18nWrapper(Register));
