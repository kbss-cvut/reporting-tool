'use strict';

var React = require('react');
var ListGroup = require('react-bootstrap').ListGroup;
var ListGroupItem = require('react-bootstrap').ListGroupItem;

var WizardStep = require('./WizardStep');
var WizardStore = require('../../stores/WizardStore');

var Wizard = React.createClass({

    propTypes: {
        start: React.PropTypes.number,
        steps: React.PropTypes.array,
        onFinish: React.PropTypes.func,
        onClose: React.PropTypes.func,
        enableForwardSkip: React.PropTypes.bool     // Whether to allow forward step skipping
    },

    getInitialState: function () {
        // First step is visited as soon as the wizard opens
        if (this.props.steps.length > 0) {
            this.props.steps[0].visited = true;
        }
        return {
            currentStep: this.props.start || 0,
            nextDisabled: false,
            previousDisabled: false
        };
    },

    getDefaultProps: function () {
        return {
            steps: []
        };
    },

    onAdvance: function () {
        var change = {};
        if (this.state.currentStep !== this.props.steps.length - 1) {
            this.props.steps[this.state.currentStep + 1].visited = true;
            change.currentStep = this.state.currentStep + 1;
        }
        this.setState(change);
    },

    onRetreat: function () {
        if (this.state.currentStep === 0) {
            return;
        }
        this.setState({
            currentStep: this.state.currentStep - 1
        });
    },

    onFinish: function (errCallback) {
        var data = {
            data: WizardStore.getData(),
            stepData: WizardStore.getStepData()
        };
        WizardStore.reset();
        this.props.onFinish(data, this.props.onClose, errCallback);
    },

    /**
     * Insert the specified step after the current one.
     * @param step The step to insert
     */
    onInsertStepAfterCurrent: function (step) {
        this.props.steps.splice(this.state.currentStep + 1, 0, step);
        WizardStore.insertStep(this.state.currentStep + 1, step.data);
    },

    /**
     * Adds the specified step to the end of this wizard.
     * @param step The step to add
     */
    onAddStep: function (step) {
        this.props.steps.push(step);
        WizardStore.insertStep(this.props.steps.length - 1, step.data);
    },

    onRemoveStep: function (stepId) {
        var stateUpdate = {};
        for (var i = 0, len = this.props.steps.length; i < len; i++) {
            if (this.props.steps[i].id === stepId) {
                this.props.steps.splice(i, 1);
                WizardStore.removeStep(i);
                if (i === this.state.currentStep && i !== 0) {
                    stateUpdate.currentStep = this.state.currentStep - 1;
                }
                break;
            }
        }
        this.setState(stateUpdate);
    },


    render: function () {
        var navMenu = this.initNavMenu();
        var component = this.initComponent();
        return (
            <div className="wizard">
                <div className="wizard-nav col-xs-2">
                    <ListGroup>
                        {navMenu}
                    </ListGroup>
                </div>
                <div className="wizard-content col-xs-10">
                    {component}
                </div>
            </div>
        );
    },

    initNavMenu: function () {
        return this.props.steps.map(function (step, index) {
            return <ListGroupItem key={'nav' + index} onClick={this.navigate} id={'wizard-nav-' + index}
                                  active={index === this.state.currentStep ? 'active' : ''}>{step.name}</ListGroupItem>;
        }.bind(this));
    },

    navigate: function (e) {
        var item = e.target;
        var index = Number(item.id.substring('wizard-nav-'.length));

        if (index === this.state.currentStep || index >= this.props.steps.length) {
            return;
        }
        // Can we jump forward?
        if (index > this.state.currentStep && !this.props.steps[index].visited && !this.props.enableForwardSkip) {
            return;
        }
        this.setState({
            currentStep: index
        });
    },

    initComponent: function () {
        if (this.props.steps.length === 0) {
            return <div className='italics'>There are no steps in this wizard.</div>;
        }
        var step = this.props.steps[this.state.currentStep];

        return React.createElement(WizardStep, {
            key: 'step' + this.state.currentStep,
            onClose: this.props.onClose,
            onFinish: this.onFinish,
            onAdvance: this.onAdvance,
            onRetreat: this.onRetreat,
            onNext: step.onNext,
            onPrevious: step.onPrevious,
            onInsertStepAfterCurrent: this.onInsertStepAfterCurrent,
            onAddStep: this.onAddStep,
            onRemoveStep: this.onRemoveStep,
            component: step.component,
            title: step.name,
            stepIndex: this.state.currentStep,
            isFirstStep: this.state.currentStep === 0,
            isLastStep: this.state.currentStep === this.props.steps.length - 1,
            defaultNextDisabled: step.defaultNextDisabled
        });
    }
});

module.exports = Wizard;
