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
