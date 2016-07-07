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

var TypeaheadResultList = React.createClass({

    render: function () {
        var listCls = this.props.options.length < 21 ? 'autocomplete-results' : 'autocomplete-results extended';
        if (this.props.customClasses.results) {
            listCls += ' ' + this.props.customClasses.results;
        }
        var items = [];
        for (var i = 0, len = this.props.options.length; i < len; i++) {
            var onClick = this.onClick.bind(this, this.props.options[i]);
            items.push(<li className='btn-link item' key={'typeahead-result-' + i}
                           onClick={onClick}>{this.getOptionLabel(this.props.options[i])}</li>);
        }
        return (
            <ul className={listCls}>
                {items}
            </ul>
        );
    },

    getOptionLabel: function (option) {
        if (typeof this.props.displayOption === 'function') {
            return this.props.displayOption(option);
        } else {
            return option[this.props.displayOption];
        }
    },

    onClick: function(option, event) {
        event.preventDefault();
        this.props.onOptionSelected(option);
    }
});

module.exports = TypeaheadResultList;
