'use strict';

import React from "react";
import injectIntl from "../../utils/injectIntl";
import I18nWrapper from "../../i18n/I18nWrapper";
import Input from "../Input";

var ReportSummary = (props) => {
    var label = props.i18n('narrative');
    return <Input type='textarea' rows='8' label={label + '*'} name='summary'
                  placeholder={label}
                  value={props.report.summary} onChange={props.onChange}
                  title={props.i18n('report.narrative-tooltip')}/>;
};

ReportSummary.propTypes = {
    report: React.PropTypes.object.isRequired,
    onChange: React.PropTypes.func.isRequired
};

export default injectIntl(I18nWrapper(ReportSummary));
