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
