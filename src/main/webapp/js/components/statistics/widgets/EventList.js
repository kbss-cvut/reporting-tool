'use strict';

import React from "react";
import FrequencyList from "./FrequencyList";

const EventList = () => {
    return <FrequencyList query="events_top_yearback" allowZeros={false}/>;
};

export default EventList;