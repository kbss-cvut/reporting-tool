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
import React, { PropTypes } from 'react';

const EditBar = ({ onEdit }) => {
    return (
        <div className="row edit-bar">
            <div className="col-sm-12 text-right">
                <button type="button" className="btn btn-default btn-xs" onClick={onEdit}>
                    <span className="glyphicon glyphicon-pencil" aria-hidden="true"></span>
                    Edit
                </button>
            </div>
        </div>
    );
};

EditBar.propTypes = {
    onEdit: PropTypes.func,
};

export default EditBar;