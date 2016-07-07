'use strict';

import React from "react";
import {ECCAIRS_URL} from "../constants/Constants";

const EccairsLink = (props) => {
    var title = 'ECCAIRS ' + (props.type ? props.type : 'attribute') + ' ' + props.text;
    return <a href={ECCAIRS_URL} title={title} target='_blank'>#{props.text}</a>;
};

EccairsLink.propTypes = {
    text: React.PropTypes.string.isRequired,
    type: React.PropTypes.string
};

export default EccairsLink;
