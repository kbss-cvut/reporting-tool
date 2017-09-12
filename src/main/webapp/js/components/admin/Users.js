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
import UserRegistration from "./UserRegistration";
import UserTable from "./UserTable";

class Users extends React.Component {
    constructor(props) {
        super(props);
        this.i18n = props.i18n;
        this.state = {
            showRegistration: false
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

    render() {
        const users = this.props.users;
        if (users === null) {
            return <Mask/>;
        }
        return <Panel header={<h5>{this.i18n('users.title')}</h5>} bsStyle='primary'>
            <UserRegistration onClose={this._closeRegistration} onSuccess={this._finishRegistration}
                              show={this.state.showRegistration}/>
            <UserTable users={users}/>
            <Button bsSize='small' bsStyle='primary'
                    onClick={this._openRegistration}>{this.i18n('users.register')}</Button>
        </Panel>;
    }
}

Users.propTypes = {
    users: PropTypes.array
};

export default injectIntl(I18nWrapper(MessageWrapper(Users)));
