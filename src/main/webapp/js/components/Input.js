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
'use strict';

import React from "react";
import ReactDOM from "react-dom";
import {Checkbox, ControlLabel, FormGroup, FormControl, HelpBlock, Radio} from "react-bootstrap";

export default class Input extends React.Component {
    static propTypes = {
        type: React.PropTypes.string,
        label: React.PropTypes.string,
        value: React.PropTypes.any,
        onChange: React.PropTypes.func,
        help: React.PropTypes.string,
        validation: React.PropTypes.oneOf(['success', 'warning', 'error'])
    };

    static defaultProps = {
        type: 'text'
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

    _renderCheckbox() {
        return <Checkbox ref={c => this.input = c} {...this.props}>{this.props.label}</Checkbox>;
    }

    _renderRadio() {
        return <Radio ref={c => this.input = c} {...this.props}>{this.props.label}</Radio>;
    }

    _renderSelect() {
        return <FormGroup bsSize='small' validationState={this.props.validation}>
            {this._renderLabel()}
            <FormControl componentClass='select' ref={c => this.input = c} {...this.props}>
                {this.props.children}
            </FormControl>
            {this.props.validation && <FormControl.Feedback />}
            {this._renderHelp()}
        </FormGroup>;
    }

    _renderLabel() {
        return this.props.label ? <ControlLabel>{this.props.label}</ControlLabel> : null;
    }

    _renderTextArea() {
        return <FormGroup bsSize='small' validationState={this.props.validation}>
            {this._renderLabel()}
            <FormControl componentClass='textarea' style={{height: 'auto'}} ref={c => this.input = c} {...this.props}/>
            {this.props.validation && <FormControl.Feedback />}
            {this._renderHelp()}
        </FormGroup>;
    }

    _renderHelp() {
        return this.props.help ? <HelpBlock>{this.props.help}</HelpBlock> : null;
    }

    _renderInput() {
        return <FormGroup bsSize='small' validationState={this.props.validation}>
            {this._renderLabel()}
            <FormControl ref={c => this.input = c} componentClass='input' {...this.props}/>
            {this.props.validation && <FormControl.Feedback />}
            {this._renderHelp()}
        </FormGroup>;
    }
}
