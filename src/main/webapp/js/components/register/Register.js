/**
 * ES6 syntax used here.
 */

'use strict';

import React from "react";
import {Alert, Button, Panel} from "react-bootstrap";
import I18nWrapper from "../../i18n/I18nWrapper";
import injectIntl from "../../utils/injectIntl";
import HorizontalInput from "../HorizontalInput";
import Logger from "../../utils/Logger";
import Mask from "../Mask";
import Routing from "../../utils/Routing";
import Routes from "../../utils/Routes";
import Ajax from "../../utils/Ajax";
import Actions from "../../actions/Actions";

class Register extends React.Component {
    // Setup state in constructor (getInitialState originally)
    constructor(props) {
        super(props);
        this.state = {
            firstName: '',
            lastName: '',
            username: '',
            password: '',
            passwordConfirm: '',
            passwordMatch: true,
            alertVisible: false,
            errorMessage: '',
            mask: false
        };
    }

    // Far arrow function with auto-binding (ES7 experimental) is used to make sure 'this' is bound automatically
    onChange = (e) => {
        var change = {};
        change[e.target.name] = e.target.value;
        this.setState(change);
    };

    onPasswordChange = (e) => {
        this.state[e.target.name] = e.target.value;
        if (this.state.password !== this.state.passwordConfirm) {
            this.setState({passwordMatch: false});
        } else {
            this.setState({passwordMatch: true});
        }
    };

    onKeyDown = (e) => {
        if (e.key === 'Enter') {
            this.register();
        }
    };

    dismissAlert = () => {
        this.setState({alertVisible: false});
    };

    isValid = () => {
        var state = this.state;
        return (state.firstName !== '' && state.lastName !== '' && state.username !== '' && state.password !== '' && state.passwordMatch);
    };

    register = () => {
        if (!this.isValid()) {
            return;
        }
        var userData = {
            firstName: this.state.firstName,
            lastName: this.state.lastName,
            username: this.state.username,
            password: this.state.password
        };
        Ajax.post('rest/persons', userData).end(function (body, resp) {
            if (resp.status === 201) {
                this.doSyntheticLogin(userData.username, userData.password);
            }
        }.bind(this), function (err) {
            this.setState({
                alertVisible: true,
                mask: false,
                errorMessage: err.message ? err.message : 'Unknown error.'
            });
        }.bind(this));
        this.setState({mask: true});
    };

    /**
     * After successful registration, perform a synthetic login so that the user receives his session and can start
     * working.
     */
    doSyntheticLogin = (username, password) => {
        Ajax.post('j_spring_security_check', null, 'form').send('username=' + username).send('password=' + password)
            .end(function (data, resp) {
                var status = JSON.parse(resp.text);
                if (!status.success || !status.loggedIn) {
                    this.setState({alertVisible: true});
                    return;
                }
                Actions.loadUser();
                Routing.transitionToHome();
            }.bind(this), function (err) {
                Logger.error('Unable to perform synthetic login. Received response with status ' + err.status);
            });
    };

    cancel = () => {
        Routing.transitionTo(Routes.login);
    };

    render() {
        var panelCls = this.state.alertVisible ? 'register-panel expanded' : 'register-panel';
        var mask = this.state.mask ? (<Mask text={this.props.i18n('register.mask')}/>) : null;
        return (
            <Panel header={<h3>{this.props.i18n('register.title')}</h3>} bsStyle='info' className={panelCls}>
                {mask}
                <form className='form-horizontal' style={{margin: '0.5em 0 0 0'}}>
                    {this.renderAlert()}
                    <div className='row'>
                        <div className='col-xs-6'>
                            <HorizontalInput type='text' name='firstName' label={this.props.i18n('register.first-name')}
                                             value={this.state.firstName}
                                             labelWidth={4} inputWidth={8} onChange={this.onChange}/>
                        </div>
                        <div className='col-xs-6'>
                            <HorizontalInput type='text' name='lastName' label={this.props.i18n('register.last-name')}
                                             value={this.state.lastName}
                                             labelWidth={4} inputWidth={8} onChange={this.onChange}/>
                        </div>
                    </div>
                    <div className='row'>
                        <div className='col-xs-6'>
                            <HorizontalInput type='text' name='username' label={this.props.i18n('register.username')}
                                             value={this.state.username}
                                             labelWidth={4} inputWidth={8} onChange={this.onChange}/>
                        </div>
                    </div>
                    <div className='row'>
                        <div className='col-xs-6'>
                            <HorizontalInput type='password' name='password'
                                             label={this.props.i18n('register.password')}
                                             labelWidth={4} inputWidth={8} onChange={this.onPasswordChange}
                                             value={this.state.password}/>
                        </div>
                        <div className='col-xs-6'>
                            {this.renderPasswordConfirm()}
                        </div>
                    </div>
                    <div style={{margin: '1em 0em 0em 0em', textAlign: 'center'}}>
                        <Button bsStyle='success' bsSize='small' ref='submit'
                                disabled={!this.isValid() || this.state.mask}
                                onClick={this.register}>{this.props.i18n('register.submit')}</Button>
                        <Button bsSize='small' onClick={this.cancel} style={{margin: '0 0 0 3.2em'}}
                                disabled={this.state.mask}>{this.props.i18n('cancel')}</Button>
                    </div>
                </form>
            </Panel>
        );
    }

    renderAlert() {
        return this.state.alertVisible ?
            <Alert bsStyle='danger' bsSize='small' dismissAfter={3000} onDismiss={this.dismissAlert}>
                <div>{this.state.errorMessage}</div>
            </Alert> : null;
    }

    renderPasswordConfirm() {
        if (this.state.passwordMatch) {
            return <HorizontalInput type='password' name='passwordConfirm'
                                    label={this.props.i18n('register.password-confirm')}
                                    labelWidth={4} inputWidth={8} onChange={this.onPasswordChange}
                                    onKeyDown={this.onKeyDown} value={this.state.passwordConfirm}/>;
        } else {
            return <HorizontalInput type='password' name='passwordConfirm'
                                    label={this.props.i18n('register.password-confirm')}
                                    labelWidth={4} inputWidth={8} onChange={this.onPasswordChange}
                                    onKeyDown={this.onKeyDown} value={this.state.passwordConfirm} validation='error'
                                    title={this.props.i18n('register.passwords-not-matching-tooltip')}/>;
        }
    }
}

// injectIntl and use the I18nWrapper to give access to the i18n function shortcut
export default injectIntl(I18nWrapper(Register));
