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
import OccurrenceClassification from "./OccurrenceClassification";
import OccurrenceDetail from "./Occurrence";

const BasicOccurrenceInfo = (props) => {
    return <div>
        <OccurrenceDetail report={props.report} onChange={props.onChange}/>

        <OccurrenceClassification onChange={props.onChange} report={props.report}/>
    </div>;
};

BasicOccurrenceInfo.propTypes = {
    report: React.PropTypes.object.isRequired,
    onChange: React.PropTypes.func.isRequired
};

export default BasicOccurrenceInfo;
