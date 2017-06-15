'use strict';

import React from "react";
import FrequencyList from "./FrequencyList";

const OccurrenceList = () => {
    return <FrequencyList query="occurrence_categories_top_yearback" allowZeros={false} fromColor="red" toColor="lemonChiffon"/>;
};

export default OccurrenceList;