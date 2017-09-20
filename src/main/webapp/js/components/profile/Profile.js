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
import {Button, Panel} from "react-bootstrap";
import classNames from "classnames";

import Ajax from "../../utils/Ajax";
import Constants from "../../constants/Constants";
import I18nWrapper from "../../i18n/I18nWrapper";
import injectIntl from "../../utils/injectIntl";
import Input from "../HorizontalInput";
import LoadingWrapper from "../misc/hoc/LoadingWrapper";
import MessageWrapper from "../misc/hoc/MessageWrapper";
import PersonValidator from "../../validation/PersonValidator";

class Profile extends React.Component {
    constructor(props) {
        super(props);
        this.i18n = props.i18n;
        this.state = {
            passwordEdit: false,
            usernameExists: false,
            originalUsername: props.user.username
        }
    }

    _onSave = () => {
        this.props.loadingOn();
        this.props.onSave(this._onSaveSuccess, this._onSaveError);
    };

    _onSaveSuccess = () => {
        this.setState({originalUsername: this.props.user.username});
        this.props.loadingOff();
        this.props.showSuccessMessage(this.i18n('profile.update.success'));
    };

    _onSaveError = (error) => {
        this.props.loadingOff();
        this.props.showErrorMessage(this.i18n('profile.update.error') + error.message);
    };

    _onChange = (e) => {
        const change = {};
        change[e.target.name] = e.target.value;
        this.props.onChange(change);
    };

    _onUsernameChange = (e) => {
        this._onChange(e);
        const value = e.target.value;
        if (this.state.originalUsername !== e.target.value) {
            Ajax.get(Constants.REST_PREFIX + 'persons/exists?username=' + value).end((data) => {
                if (data === 'true') {
                    this.setState({usernameExists: true});
                } else {
                    this.setState({usernameExists: false});
                }
            });
        }
    };

    _togglePasswordEdit = () => {
        const change = {
            password: null,
            passwordConfirm: null,
            passwordOriginal: null
        };
        this.props.onChange(change);
        this.setState({passwordEdit: !this.state.passwordEdit});
    };

    render() {
        const user = this.props.user,
            isValid = PersonValidator.isValid(user, this.state.passwordEdit),
            passwordsMatch = user.password === user.passwordConfirm,
            panelCls = classNames('profile-panel', {'expanded': this.props.messageDisplayed});
        return <Panel header={<h5>{this.i18n('profile.header')}</h5>} bsStyle='info' className={panelCls}>
            <form className='form-horizontal profile-form'>
                <div className='row'>
                    <div className='col-xs-6'>
                        <Input type='text' name='firstName' label={this.i18n('register.first-name') + '*'}
                               value={user.firstName}
                               labelWidth={4} inputWidth={8} onChange={this._onChange}/>
                    </div>
                    <div className='col-xs-6'>
                        <Input type='text' name='lastName' label={this.i18n('register.last-name') + '*'}
                               value={user.lastName}
                               labelWidth={4} inputWidth={8} onChange={this._onChange}/>
                    </div>
                </div>
                <div className='row'>
                    <div className='col-xs-6'>
                        <Input type='text' name='username' label={this.i18n('register.username') + '*'}
                               title={this.state.usernameExists ? this.i18n('profile.username.exists') : null}
                               value={user.username} validation={this.state.usernameExists ? 'error' : null}
                               labelWidth={4} inputWidth={8} onChange={this._onUsernameChange}/>
                    </div>
                </div>
                <div className='row'>
                    <div className='col-xs-1'>
                        <Button bsSize='small' bsStyle='link'
                                onClick={this._togglePasswordEdit}>{this.i18n('profile.password.toggle')}</Button>
                    </div>
                </div>
                {this._renderPasswordEdit()}
            </form>
            <div className='row'>
                <div className='col-xs-6'>
                    <div className='float-right'>
                        <Button onClick={this._onSave} bsSize='small' bsStyle='success'
                                title={!isValid ? this.i18n(passwordsMatch ? 'profile.invalid' : 'register.passwords-not-matching-tooltip') : null}
                                disabled={!isValid}>{this.i18n('save')}</Button>
                    </div>
                </div>
                <div className='col-xs-6'>
                    <Button onClick={this.props.onClose} bsSize='small' bsStyle='link'>{this.i18n('close')}</Button>
                </div>
            </div>
        </Panel>;
    }

    _renderPasswordEdit() {
        if (!this.state.passwordEdit) {
            return null;
        }
        const user = this.props.user,
            passwordsMatch = user.password === user.passwordConfirm;
        return <div>
            <div className='row'>
                <div className='col-xs-6'>
                    <Input type='password' name='passwordOriginal' label={this.i18n('profile.password.original') + '*'}
                           labelWidth={4} inputWidth={8}
                           onChange={this._onChange} value={user.passwordOriginal ? user.passwordOriginal : ''}/>
                </div>
            </div>
            <div className='row'>
                <div className='col-xs-6'>
                    <Input type='password' name='password' label={this.i18n('profile.password.new') + '*'}
                           labelWidth={4} inputWidth={8}
                           onChange={this._onChange} value={user.password ? user.password : ''}/>
                </div>
                <div className='col-xs-6'>
                    <Input type='password' name='passwordConfirm' label={this.i18n('profile.password.confirm') + '*'}
                           title={this.i18n(passwordsMatch ? null : 'register.passwords-not-matching-tooltip')}
                           labelWidth={4} inputWidth={8} validation={passwordsMatch ? null : 'error'}
                           onChange={this._onChange} value={user.passwordConfirm ? user.passwordConfirm : ''}/>
                </div>
            </div>
        </div>;
    }
}

Profile.propTypes = {
    user: PropTypes.object.isRequired,
    onChange: PropTypes.func.isRequired,
    onSave: PropTypes.func.isRequired,
    onClose: PropTypes.func.isRequired
};

export default injectIntl(I18nWrapper(LoadingWrapper(MessageWrapper(Profile))));
