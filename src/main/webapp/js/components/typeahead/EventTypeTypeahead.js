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
'use strict';

var React = require('react');
var Reflux = require('reflux');
var Typeahead = require('react-bootstrap-typeahead');
var injectIntl = require('../../utils/injectIntl');

var Actions = require('../../actions/Actions');
var TypeaheadResultList = require('./EventTypeTypeaheadResultList').default;
var TypeaheadStore = require('../../stores/TypeaheadStore');
var I18nMixin = require('../../i18n/I18nMixin');
var Utils = require('../../utils/Utils');

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
        this.listenTo(TypeaheadStore, this.onEventsLoaded);
        Actions.loadEventTypes();
        if (this.props.focus) {
            this.focus();
        }
    },
    onEventsLoaded: function () {
        var options = TypeaheadStore.getEventTypes();
        this.setState({options: Utils.processTypeaheadOptions(options)});
    },

    focus: function () {
        this.refs.eventTypeSelect.focus();
    },

    render: function () {
        var classes = {
            input: 'form-control'
        };
        var label = this.props.label ? (<label className='control-label'>{this.props.label}</label>) : null,
            value = this.props.value ? this.props.value : null,
            placeholder = this.props.placeholder ? this.props.placeholder : this.i18n('eventtype.title');
        return (
            <div>
                {label}
                <Typeahead ref='eventTypeSelect' className='form-group form-group-sm' name='eventType'
                           formInputOption='id' placeholder={placeholder} onOptionSelected={this.props.onSelect}
                           filterOption='name' value={value} displayOption='name' options={this.state.options}
                           customClasses={classes} customListComponent={TypeaheadResultList}/>
            </div>);
    }
});

module.exports = injectIntl(EventTypeTypeahead);
