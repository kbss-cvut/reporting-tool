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
import {Button, Glyphicon, Panel} from "react-bootstrap";
import assign from "object-assign";
import injectIntl from "../../utils/injectIntl";
import I18nWrapper from "../../i18n/I18nWrapper";
import CorrectiveMeasuresTable from "./CorrectiveMeasuresTable";
import CorrectiveMeasureWizardSteps from "./wizard/Steps";
import WizardStore from "../../stores/WizardStore";
import WizardWindow from "../wizard/WizardWindow";

class CorrectiveMeasures extends React.Component {
    static propTypes = {
        report: React.PropTypes.object.isRequired,
        onChange: React.PropTypes.func.isRequired
    };

    constructor(props) {
        super(props);
        this.state = {
            isWizardOpen: false,
            wizardProperties: null
        }
    }

    openWizard = (statement, onFinish) => {
        WizardStore.initWizard({statement: statement});
        this.setState({
            isWizardOpen: true,
            wizardProperties: {
                steps: CorrectiveMeasureWizardSteps,
                title: this.props.i18n('report.corrective.wizard.title'),
                onFinish: onFinish
            }
        });
    };

    closeWizard = () => {
        this.setState({isWizardOpen: false});
    };

    onAdd = () => {
        this.openWizard({}, this.addCorrectiveMeasure);
    };

    addCorrectiveMeasure = (wizardData, closeCallback) => {
        const measure = wizardData.data.statement,
            measures = this.props.report.correctiveMeasures != null ? this.props.report.correctiveMeasures : [];
        measures.push(measure);
        this.props.onChange({correctiveMeasures: measures});
        closeCallback();
    };

    updateCorrectiveMeasure = (wizardData, closeCallback) => {
        const measure = wizardData.data.statement,
            measures = this.props.report.correctiveMeasures;
        measures.splice(measure.index, 1, measure);

        delete measure.index;
        this.props.onChange({correctiveMeasures: measures});
        closeCallback();
    };

    onRemove = (index) => {
        const measures = this.props.report.correctiveMeasures;
        measures.splice(index, 1);
        this.props.onChange({correctiveMeasures: measures});
    };

    onEdit = (index) => {
        const measure = assign({}, this.props.report.correctiveMeasures[index]);
        measure.index = index;
        this.openWizard(measure, this.updateCorrectiveMeasure);
    };

    render() {
        return <div>
            {this.renderMeasures()}
            <WizardWindow {...this.state.wizardProperties} show={this.state.isWizardOpen}
                          onHide={this.closeWizard} enableForwardSkip={true}/>
        </div>;
    }

    renderMeasures() {
        const data = this.props.report.correctiveMeasures;
        let component = null;
        if (data && data.length !== 0) {
            const handlers = {
                onRemove: this.onRemove,
                onEdit: this.onEdit
            };
            component = <CorrectiveMeasuresTable data={data} handlers={handlers}/>;
        }
        const buttonCls = component ? 'float-right' : '';
        return <Panel header={<h5>{this.props.i18n('report.corrective.panel-title')}</h5>} bsStyle='info'
                      key='correctiveMeasures'>
            {component}
            <div className={buttonCls}>
                <Button bsStyle='primary' bsSize='small' onClick={this.onAdd}
                        title={this.props.i18n('report.corrective.add-tooltip')}>
                    <Glyphicon glyph='plus' className='add-glyph'/>
                    {this.props.i18n('add')}
                </Button>
            </div>
        </Panel>;
    }
}

export default injectIntl(I18nWrapper(CorrectiveMeasures));
