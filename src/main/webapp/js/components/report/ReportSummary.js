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
