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
