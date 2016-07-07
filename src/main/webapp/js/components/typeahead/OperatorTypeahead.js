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

var OperatorTypeahead = React.createClass({
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
        this.listenTo(TypeaheadStore, this.onOperatorsLoaded);
        Actions.loadOperators();
    },

    onOperatorsLoaded: function () {
        var operators = TypeaheadStore.getOperators();
        var options = [];
        for (var i = 0, len = operators.length; i < len; i++) {
            var op = operators[i];
            options.push({code: op.ICAO, name: op.operator, label: op.operator + ' (' + op.ICAO + ')'});
        }
        this.setState({options: options});
    },

    onOptionSelected: function (option) {
        this.props.onChange(option);
    },

    render: function () {
        var classes = {
            input: 'form-control',
            listItem: 'btn-link item',
            results: 'autocomplete-results'
        };
        return (
            <div className='form-group'>
                <label className='control-label'>{this.i18n('eventtype.incursion.intruder.aircraft.operator')}</label>
                <Typeahead ref='operatorSelect' className='form-group form-group-sm' name={this.props.name}
                           formInputOption='code' placeholder='Operator'
                           onOptionSelected={this.onOptionSelected} filterOption='label' displayOption='label'
                           value={this.props.value ? this.props.value : null}
                           options={this.state.options} customClasses={classes}
                           customListComponent={TypeaheadResultList}/>
            </div>
        );
    }
});

module.exports = injectIntl(OperatorTypeahead);
