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
import React, {PropTypes} from "react";

const CustomFrame = ({children, onRemove, editable, title}) => {
    return (
        <div className="x_panel fixed_height_320">
            <div className="x_title">
                <h2>{title}</h2>
                <ul className="nav navbar-right panel_toolbox">
                    {editable && <li><a onClick={() => {onRemove();}} className="close-link"><i className="fa fa-close"></i></a>
                    </li>}
                </ul>
                <div className="clearfix"></div>
            </div>
            <div className="x_content">
                {children}
            </div>
        </div>
    );
};

CustomFrame.propTypes = {
    children: PropTypes.element,
    onRemove: PropTypes.func,
    editable: PropTypes.bool,
    title: PropTypes.string,
};

export default CustomFrame;