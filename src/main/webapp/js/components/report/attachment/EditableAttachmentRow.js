/*
 * Copyright (C) 2016 Czech Technical University in Prague
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
'use strict';

import React from "react";
import assign from "object-assign";
import {Button} from "react-bootstrap";
import I18nWrapper from "../../../i18n/I18nWrapper";
import injectIntl from "../../../utils/injectIntl";
import Input from "../../Input";

class EditableAttachmentRow extends React.Component {
    static propTypes = {
        attachment: React.PropTypes.object.isRequired,
        onSave: React.PropTypes.func.isRequired,
        onCancel: React.PropTypes.func.isRequired
    };

    constructor(props) {
        super(props);
        this.i18n = props.i18n;
        this.state = {
            reference: props.attachment.reference,
            description: props.attachment.description ? props.attachment.description : ''
        };
    }

    _onChange = (e) => {
        let change = {};
        change[e.target.name.substring('attachment_edit_'.length)] = e.target.value;
        this.setState(change);
    };

    _onSave = () => {
        let result = assign({}, this.props.attachment, this.state);
        this.props.onSave(result);
    };

    render() {
        return <tr>
            <td className='report-row inline'>
                <Input name='attachment_edit_reference' value={this.state.reference} onChange={this._onChange}/>
            </td>
            <td className='report-row inline'>
                <Input name='attachment_edit_description' value={this.state.description} onChange={this._onChange}/>
            </td>
            <td className='report-row actions'>
                <Button bsStyle='success' bsSize='small'
                        onClick={this._onSave}>{this.i18n('save')}</Button>
                <Button bsSize='small'
                        onClick={this.props.onCancel}>{this.i18n('cancel')}</Button>
            </td>
        </tr>;
    }
}

export default injectIntl(I18nWrapper(EditableAttachmentRow));
