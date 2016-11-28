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
        var measure = wizardData.data.statement;
        var measures = this.props.report.correctiveMeasures != null ? this.props.report.correctiveMeasures : [];
        measures.push(measure);
        this.props.onChange({correctiveMeasures: measures});
        closeCallback();
    };

    updateCorrectiveMeasure = (wizardData, closeCallback) => {
        var measure = wizardData.data.statement,
            measures = this.props.report.correctiveMeasures;
        measures.splice(measure.index, 1, measure);

        delete measure.index;
        this.props.onChange({correctiveMeasures: measures});
        closeCallback();
    };

    onRemove = (index) => {
        var measures = this.props.report.correctiveMeasures;
        measures.splice(index, 1);
        this.props.onChange({correctiveMeasures: measures});
    };

    onEdit = (index) => {
        var measure = assign({}, this.props.report.correctiveMeasures[index]);
        measure.index = index;
        this.openWizard(measure, this.updateCorrectiveMeasure);
    };

    render() {
        return (
            <div>
                {this.renderMeasures()}
                <WizardWindow {...this.state.wizardProperties} show={this.state.isWizardOpen}
                                                               onHide={this.closeWizard} enableForwardSkip={true}/>
            </div>
        );
    }

    renderMeasures() {
        var data = this.props.report.correctiveMeasures,
            component = null;
        if (data && data.length !== 0) {
            var handlers = {
                onRemove: this.onRemove,
                onEdit: this.onEdit
            };
            component = <CorrectiveMeasuresTable data={data} handlers={handlers}/>;
        }
        var buttonCls = component ? 'float-right' : '';
        return (
            <Panel header={<h5>{this.props.i18n('report.corrective.panel-title')}</h5>} bsStyle='info'
                   key='correctiveMeasures'>
                {component}
                <div className={buttonCls}>
                    <Button bsStyle='primary' bsSize='small' onClick={this.onAdd}
                            title={this.props.i18n('report.corrective.add-tooltip')}>
                        <Glyphicon glyph='plus' style={{margin: '0 5px 0 0'}}/>
                        {this.props.i18n('add')}
                    </Button>
                </div>
            </Panel>
        );
    }
}

export default injectIntl(I18nWrapper(CorrectiveMeasures));
