'use strict';

var React = require('react');
var injectIntl = require('../../../utils/injectIntl');

var Input = require('../../Input');
var I18nMixin = require('../../../i18n/I18nMixin');
var WizardStore = require('../../../stores/WizardStore');

var Description = React.createClass({
    mixins: [I18nMixin],

    getInitialState: function () {
        var description = WizardStore.getData().statement.description;
        return {
            description: description ? description : ''
        };
    },

    componentDidMount: function () {
        if (this.state.description.trim().length !== 0) {
            this.props.enableNext();
        }
        this.refs.description.focus();
    },

    onChange: function (e) {
        var value = e.target.value,
            statement = WizardStore.getData().statement;
        statement.description = value;
        WizardStore.updateData({statement: statement});
        if (value.trim().length === 0) {
            this.props.disableNext();
        } else {
            this.props.enableNext();
        }
        this.setState({description: value});
    },
    render: function () {
        return (
            <div>
                <Input type='textarea' rows='8' label={this.i18n('description') + '*'} ref='description'
                       placeholder={this.i18n('report.corrective.description-placeholder')}
                       value={this.state.description} onChange={this.onChange}
                       title={this.i18n('report.corrective.description-tooltip')}/>
            </div>
        );
    }
});

module.exports = injectIntl(Description);
