'use strict';

var React = require('react');
var Modal = require('react-bootstrap').Modal;
var assign = require('object-assign');

var Wizard = require('./Wizard');

const WizardWindow = React.createClass({
    propTypes: {
        onHide: React.PropTypes.func,
        title: React.PropTypes.string,
        show: React.PropTypes.bool
    },

    render: function () {
        var properties = assign({}, this.props, {onClose: this.props.onHide});

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
        var modalProps = assign({}, this.props);
        delete modalProps.steps;
        delete modalProps.onFinish;
        delete modalProps.start;
        delete modalProps.enableForwardSkip;
        return modalProps;
    }
});

module.exports = WizardWindow;
