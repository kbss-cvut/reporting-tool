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
import React from "react";
import PropTypes from "prop-types";
import {Alert, Button, ButtonToolbar, Panel} from "react-bootstrap";

import I18nWrapper from "../../i18n/I18nWrapper";
import injectIntl from "../../utils/injectIntl";
import WizardStore from "../../stores/WizardStore";


class WizardStep extends React.Component {

    constructor(props) {
        super(props);
        this.i18n = props.i18n;
        this.state = {
            advanceDisabled: this.props.defaultNextDisabled,
            retreatDisabled: false
        };
    }

    onAdvance = (err) => {
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
    };

    getStepData = () => {
        return this.refs.component.getData ? this.refs.component.getData() : null;
    };

    onNext = () => {
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
    };

    onPrevious = () => {
        if (this.props.onPrevious) {
            this.props.onPrevious.apply(this, [this.props.onRetreat]);
        } else {
            this.props.onRetreat();
        }
    };

    onFinish = () => {
        WizardStore.updateStepData(this.props.stepIndex, this.getStepData());
        this.props.onFinish();
    };

    enableNext = () => {
        this.setState({advanceDisabled: false});
    };

    disableNext = () => {
        this.setState({advanceDisabled: true});
    };


    render() {
        let previousButton;
        if (!this.props.isFirstStep) {
            previousButton = <Button onClick={this.onPrevious} disabled={this.state.retreatDisabled} bsStyle='primary'
                                     bsSize='small'>{this.i18n('wizard.previous')}</Button>;
        }
        const advanceButton = this.renderAdvanceButton(),
            cancelButton = <Button onClick={this.props.onClose} bsStyle='primary'
                                   bsSize='small'>{this.i18n(this.props.readOnly ? 'close' : 'cancel')}</Button>;
        let error = null;
        if (this.state.currentError) {
            error = (<Alert bsStyle='danger'><p>{this.state.currentError.message}</p></Alert>);
        }
        const title = <h4>{this.props.title}</h4>;
        return <div className='wizard-step'>
            <Panel header={title} bsStyle='primary' className='wizard-step-content'>
                {this.renderComponent()}
            </Panel>
            <ButtonToolbar style={{float: 'right'}}>
                {previousButton}
                {advanceButton}
                {cancelButton}
            </ButtonToolbar>
            {error}
        </div>;
    }

    renderAdvanceButton() {
        const disabledTitle = this.state.advanceDisabled ? this.i18n('wizard.advance-disabled-tooltip') : null;
        if (!this.props.isLastStep) {
            return <Button onClick={this.onNext} disabled={this.state.advanceDisabled} bsStyle='primary' bsSize='small'
                           title={disabledTitle}>{this.i18n('wizard.next')}</Button>;
        } else {
            if (this.props.readOnly) {
                return null;
            }
            return <Button onClick={this.onFinish} disabled={this.state.advanceDisabled} bsStyle='primary'
                           bsSize='small' title={disabledTitle}>{this.i18n('wizard.finish')}</Button>;
        }
    }

    renderComponent() {
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
}

WizardStep.propTypes = {
    component: PropTypes.oneOfType([PropTypes.func, PropTypes.element]),
    onClose: PropTypes.func,
    onFinish: PropTypes.func.isRequired,
    onAdvance: PropTypes.func,
    onRetreat: PropTypes.func,
    onNext: PropTypes.func,
    onPrevious: PropTypes.func,
    title: PropTypes.string,
    stepIndex: PropTypes.number.isRequired,
    isFirstStep: PropTypes.bool,
    isLastStep: PropTypes.bool,
    defaultNextDisabled: PropTypes.bool,
    readOnly: PropTypes.bool
};

WizardStep.defaultProps = {
    defaultNextDisabled: false
};

export default injectIntl(I18nWrapper(WizardStep));
