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
