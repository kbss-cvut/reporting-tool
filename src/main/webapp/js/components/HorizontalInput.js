'use strict';

import React from "react";
import ReactDOM from "react-dom";
import {Checkbox, Col, ControlLabel, FormGroup, FormControl, HelpBlock, Radio} from "react-bootstrap";
import assign from "object-assign";

export default class HorizontalInput extends React.Component {
    static propTypes = {
        type: React.PropTypes.string,
        label: React.PropTypes.string,
        value: React.PropTypes.any,
        onChange: React.PropTypes.func,
        help: React.PropTypes.string,
        validation: React.PropTypes.oneOf(['success', 'warning', 'error']),
        labelWidth: React.PropTypes.number,     // Width of the label
        inputWidth: React.PropTypes.number,     // Width of the input component container
        inputOffset: React.PropTypes.number     // Offset to put before the input component. Applicable only for
                                                // checkboxes and radios
    };

    static defaultProps = {
        type: 'text',
        labelWidth: 3,
        inputWidth: 9,
        inputOffset: 3
    };

    constructor(props) {
        super(props);
    }

    focus() {
        ReactDOM.findDOMNode(this.input).focus();
    }

    getInputDOMNode() {
        return ReactDOM.findDOMNode(this.input);
    }

    render() {
        switch (this.props.type) {
            case 'radio':
                return this._renderRadio();
            case 'checkbox':
                return this._renderCheckbox();
            case 'select':
                return this._renderSelect();
            case 'textarea':
                return this._renderTextArea();
            default:
                return this._renderInput();
        }
    }

    _getInputProps() {
        var props = assign({}, this.props);
        delete props.inputOffset;
        delete props.inputWidth;
        delete props.labelWidth;
        delete props.help;
        delete props.validation;
        return props;
    }

    _renderCheckbox() {
        return <FormGroup>
            <Col smOffset={this.props.inputOffset} sm={this.props.inputWidth}>
                <Checkbox ref={c => this.input = c} {...this._getInputProps()}>{this.props.label}</Checkbox>
            </Col>
        </FormGroup>;
    }

    _renderRadio() {
        return <FormGroup>
            <Col smOffset={this.props.inputOffset} sm={this.props.inputWidth}>
                <Radio ref={c => this.input = c} {...this._getInputProps()}>{this.props.label}</Radio>
            </Col>
        </FormGroup>;
    }

    _renderSelect() {
        return <FormGroup bsSize='small' validationState={this.props.validation}>
            {this._renderLabel()}
            <Col sm={this.props.inputWidth}>
                <FormControl componentClass='select' ref={c => this.input = c} {...this._getInputProps()}>
                    {this.props.children}
                </FormControl>
                {this.props.validation && <FormControl.Feedback />}
                {this._renderHelp()}
            </Col>
        </FormGroup>;
    }

    _renderLabel() {
        return this.props.label ?
            <Col componentClass={ControlLabel} sm={this.props.labelWidth}>{this.props.label}</Col> : null;
    }

    _renderTextArea() {
        return <FormGroup bsSize='small' validationState={this.props.validation}>
            {this._renderLabel()}
            <Col sm={this.props.inputWidth}>
                <FormControl componentClass='textarea' style={{height: 'auto'}}
                             ref={c => this.input = c} {...this._getInputProps()}/>
                {this.props.validation && <FormControl.Feedback />}
                {this._renderHelp()}
            </Col>
        </FormGroup>;
    }

    _renderHelp() {
        return this.props.help ? <HelpBlock>{this.props.help}</HelpBlock> : null;
    }

    _renderInput() {
        return <FormGroup bsSize='small' validationState={this.props.validation}>
            {this._renderLabel()}
            <Col sm={this.props.inputWidth}>
                <FormControl ref={c => this.input = c} componentClass='input' {...this._getInputProps()}/>
                {this.props.validation && <FormControl.Feedback />}
                {this._renderHelp()}
            </Col>
        </FormGroup>;
    }
}
