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
/**
 * @jsx
 */
'use strict';

var React = require('react');
var Modal = require('react-bootstrap').Modal;
var Button = require('react-bootstrap').Button;

var FormattedMessage = require('react-intl').FormattedMessage;
var injectIntl = require('../../utils/injectIntl');
var I18nMixin = require('../../i18n/I18nMixin');

var DeleteReportDialog = React.createClass({
    mixins: [I18nMixin],

    propTypes: {
        onClose: React.PropTypes.func.isRequired,
        onSubmit: React.PropTypes.func.isRequired,
        show: React.PropTypes.bool.isRequired,
        reportType: React.PropTypes.string
    },

    render: function () {
        return (
            <Modal show={this.props.show} onHide={this.props.onClose}>
                <Modal.Header closeButton>
                    <Modal.Title>
                        <FormattedMessage id='delete-dialog.title' values={{type: this.props.reportType}}/>
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {this.i18n('delete-dialog.content')}
                </Modal.Body>
                <Modal.Footer>
                    <Button bsStyle='warning' bsSize='small'
                            onClick={this.props.onSubmit}>{this.i18n('delete')}</Button>
                    <Button bsSize='small' onClick={this.props.onClose}>{this.i18n('cancel')}</Button>
                </Modal.Footer>
            </Modal>
        );
    }
});

module.exports = injectIntl(DeleteReportDialog);
