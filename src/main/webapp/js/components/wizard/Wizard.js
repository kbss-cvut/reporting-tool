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
import {ListGroup, ListGroupItem} from "react-bootstrap";

import WizardStep from "./WizardStep";
import WizardStore from "../../stores/WizardStore";

class Wizard extends React.Component {

    constructor(props) {
        super(props);
        if (this.props.steps.length > 0) {
            this.props.steps[0].visited = true;
        }
        this.state = {
            currentStep: this.props.start || 0,
            nextDisabled: false,
            previousDisabled: false
        };
    }

    onAdvance = () => {
        const change = {};
        if (this.state.currentStep !== this.props.steps.length - 1) {
            this.props.steps[this.state.currentStep + 1].visited = true;
            change.currentStep = this.state.currentStep + 1;
        }
        this.setState(change);
    };

    onRetreat = () => {
        if (this.state.currentStep === 0) {
            return;
        }
        this.setState({
            currentStep: this.state.currentStep - 1
        });
    };

    onFinish = (errCallback) => {
        const data = {
            data: WizardStore.getData(),
            stepData: WizardStore.getStepData()
        };
        WizardStore.reset();
        this.props.onFinish(data, this.props.onClose, errCallback);
    };

    /**
     * Insert the specified step after the current one.
     * @param step The step to insert
     */
    onInsertStepAfterCurrent = (step) => {
        this.props.steps.splice(this.state.currentStep + 1, 0, step);
        WizardStore.insertStep(this.state.currentStep + 1, step.data);
    };

    /**
     * Adds the specified step to the end of this wizard.
     * @param step The step to add
     */
    onAddStep = (step) => {
        this.props.steps.push(step);
        WizardStore.insertStep(this.props.steps.length - 1, step.data);
    };

    onRemoveStep = (stepId) => {
        const stateUpdate = {};
        for (let i = 0, len = this.props.steps.length; i < len; i++) {
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
    };


    render() {
        const navMenu = this.initNavMenu(),
            component = this.initComponent();
        return <div className="wizard">
            <div className="wizard-nav col-xs-2">
                <ListGroup>
                    {navMenu}
                </ListGroup>
            </div>
            <div className="wizard-content col-xs-10">
                {component}
            </div>
        </div>;
    }

    initNavMenu() {
        return this.props.steps.map(function (step, index) {
            return <ListGroupItem key={'nav' + index} onClick={this.navigate} id={'wizard-nav-' + index}
                                  active={index === this.state.currentStep ? 'active' : ''}>{step.name}</ListGroupItem>;
        }.bind(this));
    }

    navigate = (e) => {
        const item = e.target,
            index = Number(item.id.substring('wizard-nav-'.length));

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
    };

    initComponent() {
        if (this.props.steps.length === 0) {
            return <div className='italics'>There are no steps in this wizard.</div>;
        }
        const step = this.props.steps[this.state.currentStep];

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
            defaultNextDisabled: step.defaultNextDisabled,
            readOnly: this.props.readOnly
        });
    }
}

Wizard.propTypes = {
    start: PropTypes.number,
    steps: PropTypes.array,
    onFinish: PropTypes.func,
    onClose: PropTypes.func,
    enableForwardSkip: PropTypes.bool,     // Whether to allow forward step skipping
    readOnly: PropTypes.bool               // Whether the wizard is read only
};

Wizard.defaultProps = {
    steps: []
};

export default Wizard;
