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
import {Panel} from "react-bootstrap";
import AttachmentTable from "./AttachmentTable";
import CreateAttachment from "./CreateAttachment";
import I18nWrapper from "../../../i18n/I18nWrapper";
import injectIntl from "../../../utils/injectIntl";

class Attachments extends React.Component {
    static propTypes = {
        report: React.PropTypes.object.isRequired,
        onChange: React.PropTypes.func.isRequired
    };

    constructor(props) {
        super(props);
        this.i18n = props.i18n;
    }

    _onAddAttachment = (newAttachment) => {
        let attachments = this.props.report.references ? this.props.report.references.slice() : [];
        attachments.push(newAttachment);
        this._onChange(attachments);
    };

    _onRemoveAttachment = (attachment) => {
        let attachments = this.props.report.references.slice();
        attachments.splice(attachments.indexOf(attachment), 1);
        this._onChange(attachments);
    };

    _onUpdateAttachment = (attachment, update) => {
        let attachments = this.props.report.references.slice();
        attachments.splice(this.props.report.references.indexOf(attachment), 1, update);
        this._onChange(attachments);
    };

    _onChange = (attachments) => {
        this.props.onChange({references: attachments});
    };

    render() {
        return <Panel header={<h5>{this.i18n('report.attachments.title')}</h5>} bsStyle='info'>
            <CreateAttachment onSave={this._onAddAttachment}/>
            <AttachmentTable onRemove={this._onRemoveAttachment} onChange={this._onUpdateAttachment}
                             attachments={this.props.report.references}/>
        </Panel>;
    }
}

export default injectIntl(I18nWrapper(Attachments));
