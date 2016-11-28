/**
 * @jsx
 */
'use strict';

var React = require('react');
var Alert = require('react-bootstrap').Alert;
var Button = require('react-bootstrap').Button;
var injectIntl = require('../utils/injectIntl');
var FormattedMessage = require('react-intl').FormattedMessage;

var Routing = require('../utils/Routing');
var I18nMixin = require('../i18n/I18nMixin');

/**
 * Shows alert with message informing that a report cannot be rendered by the application.
 *
 * Closing the alert transitions the user to the application's home.
 */
var ReportNotRenderable = React.createClass({
    mixins: [I18nMixin],

    propTypes: {
        messageId: React.PropTypes.string
    },

    onClose: function () {
        Routing.transitionToHome();
    },

    render: function () {
        var text;
        if (this.props.messageId) {
            text = <FormattedMessage id='notrenderable.error' values={{message: this.i18n(this.props.messageId)}}/>;
        } else {
            text = this.i18n('notrenderable.error-generic');
        }
        return (<Alert bsStyle='danger' onDismiss={this.onClose}>
            <h4>{this.i18n('notrenderable.title')}</h4>

            <p>{text}</p>

            <p>
                <Button onClick={this.onClose}>{this.i18n('close')}</Button>
            </p>
        </Alert>);
    }
});

module.exports = injectIntl(ReportNotRenderable);