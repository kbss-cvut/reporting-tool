'use strict';

var React = require('react');
var assign = require('object-assign');
var injectIntl = require('../../utils/injectIntl');

var Input = require('../Input');
var I18nMixin = require('../../i18n/I18nMixin');
var WizardStore = require('../../stores/WizardStore');

var InitialReport = React.createClass({
    mixins: [I18nMixin],

    getInitialState: function () {
        var text = WizardStore.getData().initialReport.text;
        return {
            text: text ? text : ''
        };
    },

    componentDidMount: function () {
        if (this.state.text.trim().length !== 0) {
            this.props.enableNext();
        }
    },

    onChange: function (e) {
        var value = e.target.value,
            initialReport = assign({}, WizardStore.getData().initialReport);
        initialReport.text = value;
        WizardStore.updateData({initialReport: initialReport});
        if (value.trim().length === 0) {
            this.props.disableNext();
        } else {
            this.props.enableNext();
        }
        this.setState({text: value});
    },

    render: function () {
        return <div>
            <Input type='textarea' rows='15' label={this.i18n('initial.label') + '*'}
                   placeholder={this.i18n('initial.label')} value={this.state.text} onChange={this.onChange}
                   title={this.i18n('initial.tooltip')}/>
        </div>;
    }
});

module.exports = injectIntl(InitialReport);
