'use strict';

import React from "react";
import {Button, Table} from "react-bootstrap";
import EditableAttachmentRow from "./EditableAttachmentRow";
import I18nWrapper from "../../../i18n/I18nWrapper";
import injectIntl from "../../../utils/injectIntl";
import Utils from "../../../utils/Utils";

class AttachmentTable extends React.Component {
    static propTypes = {
        attachments: React.PropTypes.array,
        onChange: React.PropTypes.func.isRequired,
        onRemove: React.PropTypes.func.isRequired
    };

    static defaultProps = {
        attachments: []
    };

    constructor(props) {
        super(props);
        this.i18n = props.i18n;
        this.state = {
            editedRow: -1
        };
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.attachments.length > this.props.attachments.length) {
            this._onEditCancel();
        }
    }

    _onEdit = (attachment) => {
        this.setState({editedRow: this.props.attachments.indexOf(attachment)});
    };

    _onEditFinish = (attachment) => {
        let original = this.props.attachments[this.state.editedRow];
        this.props.onChange(original, attachment);
        this._onEditCancel();
    };

    _onEditCancel = () => {
        this.setState({editedRow: -1});
    };

    render() {
        return <Table striped bordered condensed hover>
            <thead>
            <tr>
                <th className='col-xs-4 content-center'>{this.i18n('report.attachments.table.reference')}</th>
                <th className='col-xs-6 content-center'>{this.i18n('report.attachments.create.description-label')}</th>
                <th className='col-xs-2 content-center'>{this.i18n('table-actions')}</th>
            </tr>
            </thead>
            <tbody>
            {this._renderRows()}
            </tbody>
        </Table>;
    }

    _renderRows() {
        let rows = [],
            attachments = this.props.attachments;
        for (let i = 0, len = attachments.length; i < len; i++) {
            if (i === this.state.editedRow) {
                rows.push(<EditableAttachmentRow key={Utils.stringHashCode(attachments[i].reference)}
                                                 attachment={attachments[i]} onSave={this._onEditFinish}
                                                 onCancel={this._onEditCancel}/>);
            } else {
                rows.push(<AttachmentRow key={Utils.stringHashCode(attachments[i].reference)}
                                         attachment={attachments[i]}
                                         onEdit={this._onEdit} onRemove={this.props.onRemove}/>);
            }
        }
        return rows;
    }
}

/**
 * This will match http(s) and ftp(s) urls.
 */
const URL_REGEXP = /^(https?:\/\/|ftps?:\/\/)/i;

var AttachmentRow = (props) => {
    let attachment = props.attachment,
        reference = URL_REGEXP.test(attachment.reference) ?
            <a href={attachment.reference} target='_blank'>{attachment.reference}</a> : attachment.reference;
    return <tr>
        <td className='report-row'>{reference}</td>
        <td className='report-row'>{attachment.description}</td>
        <td className='report-row actions'>
            <Button bsStyle='primary' bsSize='small'
                    onClick={(e) => props.onEdit(attachment)}>{props.i18n('table-edit')}</Button>
            <Button bsStyle='warning' bsSize='small'
                    onClick={(e) => props.onRemove(attachment)}>{props.i18n('remove')}</Button>
        </td>
    </tr>;
};

AttachmentRow.propTypes = {
    attachment: React.PropTypes.object.isRequired,
    onEdit: React.PropTypes.func.isRequired,
    onRemove: React.PropTypes.func.isRequired
};

AttachmentRow = injectIntl(I18nWrapper(AttachmentRow));

export default injectIntl(I18nWrapper(AttachmentTable));
