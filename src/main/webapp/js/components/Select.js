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
var injectIntl = require('../utils/injectIntl');

var Input = require('./Input');
var I18nMixin = require('../i18n/I18nMixin');

var Select = React.createClass({
    mixins: [I18nMixin],

    propTypes: {
        options: React.PropTypes.array,
        name: React.PropTypes.string,
        title: React.PropTypes.string,
        label: React.PropTypes.string,
        onChange: React.PropTypes.func,
        addDefault: React.PropTypes.bool    // Specifies whether the default '----Select----' option should be added
    },

    focus: function () {
        this.refs.select.focus();
    },

    generateOptions: function () {
        var options = [];
        var len = this.props.options.length;
        for (var i = 0; i < len; i++) {
            var option = this.props.options[i];
            options.push(<option key={'opt_' + option.value} value={option.value}
                                 title={option.title}>{option.label}</option>);
        }
        return options;
    },

    getInputNode: function() {
        return this.refs.select.refs.input;
    },

    render: function () {
        var options = this.generateOptions();
        if (this.props.addDefault) {
            options.unshift(<option key='opt_default' value='' disabled style={{display: 'none'}}>
                {this.i18n('select.default')}
            </option>);
        }
        return (
            <Input ref='select' type='select' name={this.props.name} title={this.props.title} label={this.props.label}
                   value={this.props.value ? this.props.value : ''} onChange={this.props.onChange}>
                {options}
            </Input>
        );
    }
});

module.exports = injectIntl(Select);
