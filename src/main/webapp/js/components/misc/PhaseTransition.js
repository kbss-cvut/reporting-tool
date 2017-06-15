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

import React from "react";
import {Button} from "react-bootstrap";
import JsonLdUtils from "jsonld-utils";
import Actions from "../../actions/Actions";
import injectIntl from "../../utils/injectIntl";
import OptionsStore from "../../stores/OptionsStore";
import Vocabulary from "../../constants/Vocabulary";

class PhaseTransition extends React.Component {
    static propTypes = {
        report: React.PropTypes.object.isRequired,
        onLoading: React.PropTypes.func.isRequired,
        onSuccess: React.PropTypes.func.isRequired,
        onError: React.PropTypes.func.isRequired,
        disabled: React.PropTypes.bool
    };

    static defaultProps = {
        disabled: false
    };

    constructor(props) {
        super(props);
        this.state = {
            phases: OptionsStore.getOptions('reportingPhase')
        };
    }

    componentDidMount() {
        if (this.state.phases.length === 0) {
            Actions.loadOptions('reportingPhase');
            this.unsubscribe = OptionsStore.listen(this._onPhasesLoaded);
        }
    }

    componentWillUnmount() {
        if (this.unsubscribe) {
            this.unsubscribe();
        }
    }

    _onPhasesLoaded = (type, data) => {
        if (type == 'reportingPhase') {
            this.setState({phases: data});
        }
    };

    _onPhaseTransition = () => {
        this.props.onLoading();
        Actions.phaseTransition(this.props.report, this.props.onSuccess, this.props.onError);
    };

    _determinePhase() {
        const reportPhase = this.props.report.phase;
        return this.state.phases.find((item) => {
            return item['@id'] === reportPhase;
        });
    }

    render() {
        const phase = this._determinePhase();
        if (phase && phase[Vocabulary.TRANSITION_LABEL]) {
            return <Button bsStyle='primary' bsSize='small' disabled={this.props.disabled}
                           onClick={this._onPhaseTransition}>
                {JsonLdUtils.getLocalized(phase[Vocabulary.TRANSITION_LABEL], this.props.intl)}
            </Button>
        } else {
            return null;
        }
    }
}

export default injectIntl(PhaseTransition);
