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
import assign from "object-assign";
import {Modal} from "react-bootstrap";

import Actions from "../../actions/Actions";
import I18nWrapper from "../../i18n/I18nWrapper";
import injectIntl from "../../utils/injectIntl";
import Profile from "./Profile";
import UserStore from "../../stores/UserStore";

class ProfileController extends React.Component {
    constructor(props) {
        super(props);
        this.i18n = props.i18n;
        this.state = {};
    }

    componentDidMount() {
        this.unsubscribe = UserStore.listen(this._onUserLoaded);
        this.setState({user: UserStore.getCurrentUser()});
    }

    componentWillUnmount() {
        this.unsubscribe();
    }

    _onUserLoaded = (data) => {
        if (data.action === Actions.loadUser)
        this.setState({user: data.user});
    };

    onChange = (change) => {
        const user = assign({}, this.state.user, change);
        this.setState({user: user});
    };

    onSave = (onSuccess, onError) => {
        Actions.updateUser(this.state.user, () => {
            Actions.loadUser();
            onSuccess();
        }, onError);
    };

    render() {
        return <Modal show={this.props.show} onHide={this.props.onClose} dialogClassName='profile-container'>
            <Profile onSave={this.onSave} onClose={this.props.onClose} onChange={this.onChange} user={this.state.user}/>
        </Modal>;
    }
}

ProfileController.propTypes = {
    onClose: PropTypes.func.isRequired,
    show: PropTypes.bool
};

ProfileController.defaultProps = {
    show: false
};

export default injectIntl(I18nWrapper(ProfileController));
