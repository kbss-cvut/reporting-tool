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
import I18nWrapper from "../../i18n/I18nWrapper";
import injectIntl from "../../utils/injectIntl";
import Mask from "../Mask";
import MessageWrapper from "../misc/hoc/MessageWrapper";
import PasswordReset from "./PasswordReset";
import UserRegistration from "./UserRegistration";
import UserTable from "./UserTable";

const STATUS_UPDATE_MESSAGES = {};
const ENABLE = 'enable';
const UNLOCK = 'unlock';
const DISABLE = 'disable';
STATUS_UPDATE_MESSAGES[UNLOCK] = {
    success: 'users.unlock.success',
    failure: 'users.unlock.failure'
};
STATUS_UPDATE_MESSAGES[DISABLE] = {
    success: 'users.disable.success',
    failure: 'users.disable.failure'
};
STATUS_UPDATE_MESSAGES[ENABLE] = {
    success: 'users.enable.success',
    failure: 'users.enable.failure'
};

class Users extends React.Component {
    constructor(props) {
        super(props);
        this.i18n = props.i18n;
        this.state = {
            showRegistration: false,
            showUnlock: false,
            unlockUser: null,
            statusPending: null
        };
    }

    _openRegistration = () => {
        this.setState({showRegistration: true});
    };

    _finishRegistration = () => {
        this.props.showSuccessMessage(this.i18n('users.register.success'));
        this._closeRegistration();
    };

    _closeRegistration = () => {
        this.setState({showRegistration: false});
    };

    _openUnlock = (user) => {
        this.setState({showUnlock: true, unlockUser: user});
    };

    _unlockUser = (newPassword) => {
        this.setState({statusPending: this.state.unlockUser});
        this.props.actions.unlock(this.state.unlockUser, newPassword, this._onStatusUpdateSuccess, this._onStatusUpdateFailure);
        this._closeUnlock();
    };

    _closeUnlock = () => {
        this.setState({showUnlock: false, unlockUser: null});
    };

    _onStatusUpdateSuccess = (action) => {
        const user = this.state.statusPending;
        this.props.showSuccessMessage(this.props.formatMessage(STATUS_UPDATE_MESSAGES[action].success, {
            firstName: user.firstName,
            lastName: user.lastName
        }));
        this.setState({statusPending: null});
    };

    _onStatusUpdateFailure = (action) => {
        const user = this.state.statusPending;
        this.props.showErrorMessage(this.props.formatMessage(STATUS_UPDATE_MESSAGES[action].failure, {
            firstName: user.firstName,
            lastName: user.lastName
        }));
        this.setState({statusPending: null});
    };

    _disableUser = (user) => {
        this.setState({statusPending: user});
        this.props.actions.disable(user, this._onStatusUpdateSuccess, this._onStatusUpdateFailure);
    };

    _enableUser = (user) => {
        this.setState({statusPending: user});
        this.props.actions.enable(user, this._onStatusUpdateSuccess, this._onStatusUpdateFailure);
    };

    render() {
        const users = this.props.users;
        if (users === null) {
            return <Mask/>;
        }
        const actions = {
            unlock: this._openUnlock,
            enable: this._enableUser,
            disable: this._disableUser
        };
        return <Panel header={<h5>{this.i18n('users.title')}</h5>} bsStyle='primary'>
            <UserRegistration onClose={this._closeRegistration} onSuccess={this._finishRegistration}
                              show={this.state.showRegistration}/>
            <PasswordReset show={this.state.showUnlock} user={this.state.unlockUser} onSubmit={this._unlockUser}
                           onCancel={this._closeUnlock}/>
            <UserTable users={users} actions={actions} statusPending={this.state.statusPending}/>
            <Button bsSize='small' bsStyle='primary'
                    onClick={this._openRegistration}>{this.i18n('users.register')}</Button>
        </Panel>;
    }
}

Users.propTypes = {
    users: PropTypes.array,
    actions: PropTypes.object.isRequired
};

export default injectIntl(I18nWrapper(MessageWrapper(Users)));
export {ENABLE, DISABLE, UNLOCK};
