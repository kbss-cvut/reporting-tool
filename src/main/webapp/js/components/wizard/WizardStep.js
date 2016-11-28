'use strict';

var React = require('react');
var Alert = require('react-bootstrap').Alert;
var Button = require('react-bootstrap').Button;
var ButtonToolbar = require('react-bootstrap').ButtonToolbar;
var Panel = require('react-bootstrap').Panel;

var injectIntl = require('../../utils/injectIntl');
var I18nMixin = require('../../i18n/I18nMixin');
var WizardStore = require('../../stores/WizardStore');

var WizardStep = React.createClass({
    mixins: [I18nMixin],

    propTypes: {
        onClose: React.PropTypes.func,
        onFinish: React.PropTypes.func.isRequired,
        onAdvance: React.PropTypes.func,
        onRetreat: React.PropTypes.func,
        onNext: React.PropTypes.func,
        onPrevious: React.PropTypes.func,
        title: React.PropTypes.string,
        stepIndex: React.PropTypes.number.isRequired,
        isFirstStep: React.PropTypes.bool,
        isLastStep: React.PropTypes.bool,
        defaultNextDisabled: React.PropTypes.bool
    },

    getInitialState: function () {
        return {
            advanceDisabled: this.props.defaultNextDisabled != null ? this.props.defaultNextDisabled : false,
            retreatDisabled: false
        };
    },

    onAdvance: function (err) {
        if (err) {
            this.setState({
                advanceDisabled: false,
                retreatDisabled: false,
                currentError: err
            });
        } else {
            WizardStore.updateStepData(this.props.stepIndex, this.getStepData());
            this.props.onAdvance();
        }
    },

    getStepData: function () {
        return this.refs.component.getData ? this.refs.component.getData() : null;
    },

    onNext: function () {
        this.setState({
            advanceDisabled: true,
            retreatDisabled: true
        });
        if (this.props.onNext) {
            this.props.onNext.apply(this, [this.onAdvance]);
        } else {
            WizardStore.updateStepData(this.props.stepIndex, this.getStepData());
            this.props.onAdvance();
        }
    },

    onPrevious: function () {
        if (this.props.onPrevious) {
            this.props.onPrevious.apply(this, [this.props.onRetreat]);
        } else {
            this.props.onRetreat();
        }
    },

    onFinish: function () {
        WizardStore.updateStepData(this.props.stepIndex, this.getStepData());
        this.props.onFinish();
    },

    enableNext: function () {
        this.setState({advanceDisabled: false});
    },

    disableNext: function () {
        this.setState({advanceDisabled: true});
    },


    render: function () {
        var previousButton;
        if (!this.props.isFirstStep) {
            previousButton = (<Button onClick={this.onPrevious} disabled={this.state.retreatDisabled} bsStyle='primary'
                                      bsSize='small'>{this.i18n('wizard.previous')}</Button>);
        }
        var advanceButton = this.renderAdvanceButton();
        var cancelButton = (
            <Button onClick={this.props.onClose} bsStyle='primary' bsSize='small'>{this.i18n('cancel')}</Button>);
        var error = null;
        if (this.state.currentError) {
            error = (<Alert bsStyle='danger'><p>{this.state.currentError.message}</p></Alert>);
        }
        var title = (<h4>{this.props.title}</h4>);
        return (
            <div className='wizard-step'>
                <Panel header={title} bsStyle='primary' className='wizard-step-content'>
                    {this.renderComponent()}
                </Panel>
                <ButtonToolbar style={{float: 'right'}}>
                    {previousButton}
                    {advanceButton}
                    {cancelButton}
                </ButtonToolbar>
                {error}
            </div>
        );
    },

    renderAdvanceButton: function () {
        var disabledTitle = this.state.advanceDisabled ? this.i18n('wizard.advance-disabled-tooltip') : null;
        var button;
        if (!this.props.isLastStep) {
            button = (
                <Button onClick={this.onNext} disabled={this.state.advanceDisabled} bsStyle='primary' bsSize='small'
                        title={disabledTitle}>{this.i18n('wizard.next')}</Button>);
        } else {
            button = (
                <Button onClick={this.onFinish} disabled={this.state.advanceDisabled} bsStyle='primary' bsSize='small'
                        title={disabledTitle}>{this.i18n('wizard.finish')}</Button>);
        }
        return button;
    },

    renderComponent: function () {
        return React.createElement(this.props.component, {
            ref: 'component',
            stepIndex: this.props.stepIndex,
            enableNext: this.enableNext,
            disableNext: this.disableNext,
            next: this.onNext,
            previous: this.onPrevious,
            finish: this.onFinish,
            insertStepAfterCurrent: this.props.onInsertStepAfterCurrent,
            addStep: this.props.onAddStep,
            removeStep: this.props.onRemoveStep
        });
    }
});

module.exports = injectIntl(WizardStep);
