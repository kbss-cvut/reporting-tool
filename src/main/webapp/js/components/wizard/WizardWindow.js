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
'use strict';

const React = require('react');
const Modal = require('react-bootstrap').Modal;
const assign = require('object-assign');

const Wizard = require('./Wizard');

const WizardWindow = React.createClass({
    propTypes: {
        onHide: React.PropTypes.func,
        title: React.PropTypes.string,
        show: React.PropTypes.bool
    },

    render: function () {
        const properties = assign({}, this.props, {onClose: this.props.onHide});

        return <Modal {...this._getModalProps()} show={this.props.show} bsSize="large" title={this.props.title}
                      animation={true} dialogClassName="large-modal">
            <Modal.Header closeButton>
                <Modal.Title>{this.props.title}</Modal.Title>
            </Modal.Header>

            <div className="modal-body" style={{overflow: 'hidden'}}>
                <Wizard {...properties}/>
            </div>
        </Modal>;
    },

    _getModalProps: function () {
        const modalProps = assign({}, this.props);
        delete modalProps.steps;
        delete modalProps.onFinish;
        delete modalProps.start;
        delete modalProps.enableForwardSkip;
        return modalProps;
    }
});

module.exports = WizardWindow;
