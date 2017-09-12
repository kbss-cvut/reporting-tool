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
import {Alert, Button, ButtonToolbar} from "react-bootstrap";
import {FormattedMessage} from "react-intl";
import I18nWrapper from "../i18n/I18nWrapper";
import injectIntl from "../utils/injectIntl";
import Routing from "../utils/Routing";

/**
 * Shows alert with message informing that a report cannot be rendered by the application.
 *
 * Closing the alert transitions the user to the application's home.
 */
class ReportNotRenderable extends React.Component {

    static propTypes = {
        messageId: React.PropTypes.string,
        canFix: React.PropTypes.bool,
        onFix: React.PropTypes.func
    };

    static defaultProps = {
        canFix: false
    };

    constructor(props) {
        super(props);
        this.i18n = props.i18n;
    }

    onClose() {
        Routing.transitionToHome();
    }

    render() {
        let text;
        if (this.props.messageId) {
            text = <FormattedMessage id='notrenderable.error' values={{message: this.i18n(this.props.messageId)}}/>;
        } else {
            text = this.i18n('notrenderable.error-generic');
        }
        return (<Alert bsStyle='danger' onDismiss={this.onClose}>
            <h4>{this.i18n('notrenderable.title')}</h4>

            <p>{text}</p>

            <ButtonToolbar className='detail-button-toolbar'>
                {this.props.canFix &&
                <Button onClick={this.props.onFix} bsStyle='primary' bsSize='small'>{this.i18n('issue-fix')}</Button>}
                <Button onClick={this.onClose} bsSize='small'>{this.i18n('close')}</Button>
            </ButtonToolbar>
        </Alert>);
    }
}

export default injectIntl(I18nWrapper(ReportNotRenderable));