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
import {Glyphicon, Table} from "react-bootstrap";

import I18nWrapper from "../../i18n/I18nWrapper";
import injectIntl from "../../utils/injectIntl";

class UserTable extends React.Component {
    constructor(props) {
        super(props);
        this.i18n = props.i18n;
    }

    render() {
        return <Table bordered condensed hover striped>
            <thead>
            <tr>
                <th className='col-xs-5 content-center'>{this.i18n('users.table.name')}</th>
                <th className='col-xs-4 content-center'>{this.i18n('users.table.username')}</th>
                <th className='col-xs-1 content-center'>{this.i18n('users.table.status')}</th>
                <th className='col-xs-2 content-center'>{this.i18n('table-actions')}</th>
            </tr>
            </thead>
            <tbody>
            {this._renderRows()}
            </tbody>
        </Table>;
    }

    _renderRows() {
        const users = this.props.users,
            rows = [];
        for (let i = 0, len = users.length; i < len; i++) {
            rows.push(<UserRow key={users[i].uri} user={users[i]}/>);
        }
        return rows;
    }
}

UserTable.propTypes = {
    users: PropTypes.array.isRequired
};

let UserRow = (props) => {
    const user = props.user,
        i18n = props.i18n;
    return <tr>
        <td className='vertical-middle'>{user.firstName + ' ' + user.lastName}</td>
        <td className='vertical-middle'>{user.username}</td>
        <td className='vertical-middle content-center'>
            <Glyphicon glyph={user.blocked ? 'alert' : 'ok'}
                       title={i18n(user.blocked ? 'users.table.blocked.tooltip' : 'users.table.not.blocked.tooltip')}/>
        </td>
        <td className='vertical-middle actions'>
            &nbsp;
        </td>
    </tr>;
};

UserRow.propTypes = {
    user: PropTypes.object.isRequired
};

UserRow = injectIntl(I18nWrapper(UserRow));

export default injectIntl(I18nWrapper(UserTable));
