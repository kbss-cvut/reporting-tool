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
'use strict';

import React from "react";
import assign from "object-assign";
import {Button} from "react-bootstrap";
import I18nWrapper from "../../../i18n/I18nWrapper";
import injectIntl from "../../../utils/injectIntl";
import Input from "../../Input";

const PREFIX_LENGTH = "attachment_".length;

class CreateAttachment extends React.Component {
    static propTypes = {
        onSave: React.PropTypes.func.isRequired
    };

    constructor(props) {
        super(props);
        this.i18n = props.i18n;
        this.state = {
            reference: '',
            description: ''
        };
    }

    _onChange = (e) => {
        let change = {};
        change[e.target.name.substring(PREFIX_LENGTH)] = e.target.value;
        this.setState(change);
    };

    _onSave = () => {
        this.props.onSave(assign({}, this.state));
        this.setState({
            reference: '',
            description: ''
        });
    };

    render() {
        const valid = this.state.reference.length > 0;
        return <div className='row form-group'>
            <div className='col-xs-4'>
                <Input name='attachment_reference'
                       label={this.i18n('report.attachments.create.reference-label')}
                       title={this.i18n('report.attachments.create.reference-tooltip')}
                       value={this.state.reference} onChange={this._onChange}/>
            </div>
            <div className='col-xs-7'>
                <Input name='attachment_description'
                       label={this.i18n('report.attachments.create.description-label')}
                       title={this.i18n('report.attachments.create.description-tooltip')}
                       value={this.state.description} onChange={this._onChange}/>
            </div>
            <div className='col-xs-1'>
                <Button className='in-input-line' bsSize='small' bsStyle='primary' onClick={this._onSave}
                        disabled={!valid} title={!valid ? this.i18n('report.attachments.save.disabled-tooltip') : null}>
                    {this.i18n('report.attachments.create.button')}
                </Button>
            </div>
        </div>;
    }
}

export default injectIntl(I18nWrapper(CreateAttachment));
