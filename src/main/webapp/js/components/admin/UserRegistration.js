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
import {Modal} from "react-bootstrap";

import Actions from "../../actions/Actions";
import Ajax from "../../utils/Ajax";
import I18nStore from "../../stores/I18nStore";
import Register from "../register/Register";

class UserRegistration extends React.Component {
    constructor(props) {
        super(props);
        this.i18n = props.i18n;
    }

    _register = (user, onSuccess, onError) => {
        Ajax.post('rest/persons', user).end((body, resp) => {
            if (resp.status === 201) {
                onSuccess();
                Actions.loadUsers();
                this.props.onSuccess();
            }
        }, (err) => {
            onError(err.message ? err.message : I18nStore.i18n('register.error'));
        });
    };

    render() {
        return <Modal show={this.props.show} onHide={this.props.onClose} dialogClassName='profile-container'>
            <Register onRegister={this._register} onCancel={this.props.onClose}/>
        </Modal>;
    }
}

UserRegistration.propTypes = {
    show: PropTypes.bool,
    onClose: PropTypes.func.isRequired,
    onSuccess: PropTypes.func.isRequired
};

export default UserRegistration;
