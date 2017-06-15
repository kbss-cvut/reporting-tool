'use strict';

import React from "react";
import I18nWrapper from "../../i18n/I18nWrapper";
import injectIntl from "../../utils/injectIntl";
import Mask from "../Mask";
import ReportType from "../../model/ReportType";
import ResourceNotFound from "../ResourceNotFound";

const Report = (props) => {
    const report = props.report;
    if (props.loading) {
        return <Mask text={props.i18n('detail.loading')}/>;
    }
    if (!report) {
        return <ResourceNotFound resource={props.i18n('detail.not-found.title')}/>;
    }
    return React.createElement(ReportType.getDetailController(report), {
        report: report,
        revisions: props.revisions
    });
};

Report.propTypes = {
    report: React.PropTypes.object,
    revisions: React.PropTypes.array,
    loading: React.PropTypes.bool
};

export default injectIntl(I18nWrapper(Report));
