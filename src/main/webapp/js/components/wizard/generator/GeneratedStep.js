'use strict';

import React from "react";
import assign from "object-assign";
import Question from "./Question";
import WizardStore from "../../../stores/WizardStore";

export default class GeneratedStep extends React.Component {
    static propTypes = {
        stepIndex: React.PropTypes.number.isRequired
    };

    constructor(props) {
        super(props);
        this.state = {
            question: WizardStore.getStepData([this.props.stepIndex])
        };
    }

    componentDidMount() {
        this.unsubscribe = WizardStore.listen(this._onStoreTrigger);
    }

    componentWillUnmount() {
        this.unsubscribe();
    }

    _onStoreTrigger = () => {
        this.setState({question: WizardStore.getStepData(this.props.stepIndex)});
    };

    onChange = (index, change) => {
        WizardStore.updateStepData(this.props.stepIndex, assign(this.state.question, change));
    };

    render() {
        return <Question question={this.state.question} onChange={this.onChange} withoutPanel={true}/>;
    }
}
