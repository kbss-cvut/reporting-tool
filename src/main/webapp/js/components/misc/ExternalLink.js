'use strict';

import React from "react";
import classNames from "classnames";

const ExternalLink = (props) => {
    var classes = classNames('external-link', props.className);
    return <a href={props.url} title={props.title} target='_blank' className={classes}/>;
};

ExternalLink.propTypes = {
    url: React.PropTypes.string.isRequired,
    title: React.PropTypes.string,
    className: React.PropTypes.string
};

export default ExternalLink;
