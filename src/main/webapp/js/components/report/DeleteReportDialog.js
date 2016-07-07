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
