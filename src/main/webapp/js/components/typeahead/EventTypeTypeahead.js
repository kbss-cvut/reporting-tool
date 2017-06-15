'use strict';

var React = require('react');
var Reflux = require('reflux');
var Typeahead = require('react-bootstrap-typeahead');
var injectIntl = require('../../utils/injectIntl');
var JsonLdUtils = require('jsonld-utils').default;

var Actions = require('../../actions/Actions');
var TypeaheadResultList = require('./EventTypeTypeaheadResultList').default;
var OptionsStore = require('../../stores/OptionsStore');
var I18nMixin = require('../../i18n/I18nMixin');

var EventTypeTypeahead = React.createClass({
    mixins: [Reflux.ListenerMixin, I18nMixin],

    propTypes: {
        onSelect: React.PropTypes.func.isRequired
    },

    getInitialState: function () {
        return {
            options: []
        };
    },

    componentDidMount: function () {
        this.listenTo(OptionsStore, this.onEventsLoaded);
        Actions.loadOptions('eventType');
        if (this.props.focus) {
            this.focus();
        }
    },

    onEventsLoaded: function (type, data) {
        if (type === 'eventType') {
            this.setState({options: JsonLdUtils.processTypeaheadOptions(data)});
        }
    },

    focus: function () {
        this.refs.eventTypeSelect.focus();
    },

    render: function () {
        var value = this.props.value ? this.props.value : null,
            placeholder = this.props.placeholder ? this.props.placeholder : this.i18n('eventtype.title');

        return <Typeahead ref='eventTypeSelect' label={this.props.label} name='eventType' size='small'
                          formInputOption='id' placeholder={placeholder} onOptionSelected={this.props.onSelect}
                          filterOption='name' value={value} displayOption='name' options={this.state.options}
                          customListComponent={TypeaheadResultList}/>;
    }
});

module.exports = injectIntl(EventTypeTypeahead);
