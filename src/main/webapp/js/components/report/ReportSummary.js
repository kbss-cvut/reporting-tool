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
