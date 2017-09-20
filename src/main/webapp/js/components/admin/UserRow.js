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
import {Button, Glyphicon} from "react-bootstrap";
import classNames from "classnames";

import I18nWrapper from "../../i18n/I18nWrapper";
import injectIntl from "../../utils/injectIntl";
import Mask from "../Mask";
import UserStore from "../../stores/UserStore";
import Vocabulary from "../../constants/Vocabulary";

class UserRow extends React.Component {
    constructor(props) {
        super(props);
        this.i18n = props.i18n;
    }

    _isLocked() {
        return this.props.user.types.indexOf(Vocabulary.LOCKED) !== -1;
    }

    _isDisabled() {
        return this.props.user.types.indexOf(Vocabulary.DISABLED) !== -1;
    }

    _resolveStatusIcon() {
        if (this._isLocked()) {
            return {glyph: 'ban-circle', title: 'users.table.status.locked.tooltip'};
        } else if (this._isDisabled()) {
            return {glyph: 'minus', title: 'users.table.status.disabled.tooltip'};
        } else {
            return {glyph: 'ok', title: 'users.table.status.normal.tooltip'};
        }
    }

    render() {
        const user = this.props.user,
            classes = classNames('vertical-middle', {'italics': this._isDisabled()}),
            userStatus = this._resolveStatusIcon(),
            status = this.props.pending ? <Mask classes='mask-container' withoutText/> :
                <Glyphicon glyph={userStatus.glyph} title={this.i18n(userStatus.title)}/>;

        return <tr>
            <td className={classes}>{user.firstName + ' ' + user.lastName}</td>
            <td className={classes}>{user.username}</td>
            <td className='vertical-middle content-center status'>
                {status}
            </td>
            <td className='vertical-middle actions'>
                {this._renderUnlockButton()}
                {this._renderAccountEnableDisableButton()}
            </td>
        </tr>;
    }

    _renderUnlockButton() {
        if (!this._isLocked() || this.props.pending) {
            return null;
        }
        return <Button bsStyle='primary' bsSize='small' onClick={() => this.props.unlock(this.props.user)}
                       title={this.i18n('users.table.locked.unlock.tooltip')}>{this.i18n('users.table.locked.unlock')}</Button>;
    }

    _renderAccountEnableDisableButton() {
        const user = this.props.user;
        if (UserStore.getCurrentUser().uri === user.uri) {
            return null;
        }
        if (this._isDisabled()) {
            return <Button bsStyle='success' bsSize='small'
                           onClick={() => this.props.enable(user)}>{this.i18n('users.enable')}</Button>;
        } else {
            return <Button bsStyle='warning' bsSize='small'
                           onClick={() => this.props.disable(user)}>{this.i18n('users.disable')}</Button>;
        }
    }
}

UserRow.propTypes = {
    user: PropTypes.object.isRequired,
    unlock: PropTypes.func.isRequired,
    enable: PropTypes.func.isRequired,
    disable: PropTypes.func.isRequired,
    pending: PropTypes.bool
};

export default injectIntl(I18nWrapper(UserRow));
