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
