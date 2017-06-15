'use strict';

import React from "react";
import I18nWrapper from "../../../i18n/I18nWrapper";
import injectIntl from "../../../utils/injectIntl";
import Input from "../../Input";
import WizardStore from "../../../stores/WizardStore";

class Description extends React.Component {

    constructor(props) {
        super(props);
        this.i18n = props.i18n;
        const description = WizardStore.getData().statement.description;
        this.state = {
            description: description ? description : ''
        };
    }

    componentDidMount() {
        if (this.state.description.trim().length !== 0) {
            this.props.enableNext();
        }
        this.descriptionInput.focus();
    }

    onChange = (e) => {
        const value = e.target.value,
            statement = WizardStore.getData().statement;
        statement.description = value;
        WizardStore.updateData({statement: statement});
        if (value.trim().length === 0) {
            this.props.disableNext();
        } else {
            this.props.enableNext();
        }
        this.setState({description: value});
    };

    onKeyUp = (e) => {
        if (e.keyCode === 13 && e.ctrlKey && this.state.description.trim().length !== 0) {
            this.props.finish();
        }
    };

    render() {
        return <div>
            <Input type='textarea' rows='8' label={this.i18n('description') + '*'} ref={c => this.descriptionInput = c}
                   placeholder={this.i18n('report.corrective.description-placeholder')}
                   value={this.state.description} onChange={this.onChange} onKeyUp={this.onKeyUp}
                   title={this.i18n('report.corrective.description-tooltip')}/>
        </div>;
    }
}

export default injectIntl(I18nWrapper(Description));
