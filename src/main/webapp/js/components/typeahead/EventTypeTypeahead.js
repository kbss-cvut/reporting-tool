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
