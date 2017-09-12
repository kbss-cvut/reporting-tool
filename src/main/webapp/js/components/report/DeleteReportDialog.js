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
import {Button, Modal} from "react-bootstrap";
import {FormattedMessage} from "react-intl";
import I18nWrapper from "../../i18n/I18nWrapper";
import injectIntl from "../../utils/injectIntl";
import Mask from "../Mask";

class DeleteReportDialog extends React.Component {
    static propTypes = {
        onClose: React.PropTypes.func.isRequired,
        onSubmit: React.PropTypes.func.isRequired,
        show: React.PropTypes.bool.isRequired,
        reportType: React.PropTypes.string
    };

    constructor(props) {
        super(props);
        this.i18n = props.i18n;
        this.state = {
            loading: false
        }
    }

    _onSubmit = () => {
        this.setState({loading: true});
        this.props.onSubmit();
    };

    render() {
        return <Modal show={this.props.show} onHide={this.props.onClose}>
            {this.state.loading ? <Mask/> : null}
            <Modal.Header closeButton>
                <Modal.Title>
                    <FormattedMessage id='delete-dialog.title' values={{type: this.props.reportType}}/>
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {this.i18n('delete-dialog.content')}
            </Modal.Body>
            <Modal.Footer>
                <Button bsStyle='warning' bsSize='small' onClick={this._onSubmit}>{this.i18n('delete')}</Button>
                <Button bsSize='small' onClick={this.props.onClose}>{this.i18n('cancel')}</Button>
            </Modal.Footer>
        </Modal>;
    }
}

export default injectIntl(I18nWrapper(DeleteReportDialog));
