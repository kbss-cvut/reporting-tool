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
