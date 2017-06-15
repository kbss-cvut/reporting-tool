'use strict';

import React from "react";

const DashboardTile = (props) => {
    return <button className='dashboard-tile btn-primary btn'
                onClick={props.onClick} disabled={props.disabled}>{props.children}</button>;
};

DashboardTile.propTypes = {
    onClick: React.PropTypes.func.isRequired,
    disabled: React.PropTypes.bool
};

export default DashboardTile;
