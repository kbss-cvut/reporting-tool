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
