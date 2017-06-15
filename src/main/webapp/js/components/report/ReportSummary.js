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
import injectIntl from "../../utils/injectIntl";
import I18nWrapper from "../../i18n/I18nWrapper";
import RichInput from "../misc/RichInput";

class ReportSummary extends React.Component {
    static propTypes = {
        report: React.PropTypes.object.isRequired,
        onChange: React.PropTypes.func.isRequired
    };

    constructor(props) {
        super(props);
        this.i18n = props.i18n;
    }

    _onChange = (value) => {
        this.props.onChange({summary: value});
    };

    render() {
        return <div className='form-group'>
            <RichInput label={this.i18n('narrative') + '*'} title={this.i18n('report.narrative-tooltip')}
                       placeholder={this.i18n('narrative')} value={this.props.report.summary}
                       onChange={this._onChange}/>
        </div>;
    }
}

export default injectIntl(I18nWrapper(ReportSummary));
