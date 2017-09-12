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
/**
 * @jsx
 */

'use strict';

var React = require('react');

var DEFAULT_THRESHOLD = 120;

var CollapsibleText = React.createClass({

    propTypes: {
        text: React.PropTypes.string
    },

    getInitialState: function () {
        return {
            expanded: this.props.defaultExpanded != null ? this.props.defaultExpanded : false
        };
    },

    onToggle: function () {
        this.setState({expanded: !this.state.expanded});
    },

    getTextPreview: function () {
        var threshold = this.props.maxLength ? this.props.maxLength : DEFAULT_THRESHOLD;
        if (!this.props.text) {
            return '';
        }
        return this.props.text.length > threshold ? (this.props.text.substring(0, threshold) + '...') : this.props.text;
    },

    getText: function () {
        return this.state.expanded ? this.props.text : this.getTextPreview();
    },

    isShortened: function (text) {
        var threshold = this.props.maxLength ? this.props.maxLength : DEFAULT_THRESHOLD;
        return this.props.text != null && this.props.text.length > threshold;
    },

    render: function () {
        var style = this.state.expanded ? {whiteSpace: 'pre-wrap'} : {};
        var title = this.isShortened(this.props.text) ? 'Click to see full text' : this.props.text;
        return (
            <div title={title} onClick={this.onToggle} style={style}>
                {this.getText()}
            </div>
        );
    }
});

module.exports = CollapsibleText;
