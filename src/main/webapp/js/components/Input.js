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
var BootstrapInput = require('react-bootstrap').Input;

var Input = React.createClass({

    focus: function() {
        this.refs.input.getInputDOMNode().focus();
    },

    render: function () {
        if (this.props.type === 'textarea') {
            return <BootstrapInput ref='input' bsSize='small' style={{height: 'auto'}} {...this.props}/>;
        } else {
            return <BootstrapInput ref='input' bsSize='small' {...this.props}/>;
        }
    }
});

module.exports = Input;
