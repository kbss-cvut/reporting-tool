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

import Actions from "../../actions/Actions";
import Users from "./Users";
import UserStore from "../../stores/UserStore";

export default class UsersController extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            users: null
        };
    }

    componentDidMount() {
        this.unsubscribe = UserStore.listen(this._onUsersLoaded);
        Actions.loadUsers();
    }

    componentWillUnmount() {
        this.unsubscribe();
    }

    _onUsersLoaded = (data) => {
        if (data.action === Actions.loadUsers) {
            this.setState({users: data.users});
        }
    };

    render() {
        return <div>
            <Users users={this.state.users}/>
        </div>;
    }
}
