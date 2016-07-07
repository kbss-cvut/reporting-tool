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
var Reflux = require('reflux');
var Typeahead = require('react-bootstrap-typeahead');
var injectIntl = require('../../utils/injectIntl');

var Actions = require('../../actions/Actions');
var TypeaheadStore = require('../../stores/TypeaheadStore');
var TypeaheadResultList = require('./TypeaheadResultList');
var I18nMixin = require('../../i18n/I18nMixin');

var LocationTypeahead = React.createClass({
    mixins: [Reflux.ListenerMixin, I18nMixin],

    propTypes: {
        name: React.PropTypes.string,
        value: React.PropTypes.string,
        onChange: React.PropTypes.func
    },

    getInitialState: function () {
        return {
            options: []
        };
    },

    componentWillMount: function () {
        this.listenTo(TypeaheadStore, this.onLocationsLoaded);
        Actions.loadLocations();
    },

    onLocationsLoaded: function () {
        var locations = TypeaheadStore.getLocations();
        var options = [];
        for (var i = 0, len = locations.length; i < len; i++) {
            var loc = locations[i].id;
            var name = loc.substring(loc.lastIndexOf('/') + 1);
            options.push({id: locations[i].id, name: name});
        }
        this.setState({options: options});
    },

    onOptionSelected: function (option) {
        this.props.onChange(option);
    },

    render: function () {
        var classes = {
            input: 'form-control'
        };
        return (
            <div>
                <label className='control-label'>{this.i18n('eventtype.incursion.location.label')}</label>
                <Typeahead ref='locationSelect' className='form-group form-group-sm' name={this.props.name}
                           formInputOption='id' placeholder={this.i18n('eventtype.incursion.location.label')}
                           onOptionSelected={this.onOptionSelected} filterOption='name' displayOption='name'
                           value={this.props.value ? this.props.value : null}
                           options={this.state.options} customClasses={classes}
                           customListComponent={TypeaheadResultList}/>
            </div>
        );
    }
});

module.exports = injectIntl(LocationTypeahead);
