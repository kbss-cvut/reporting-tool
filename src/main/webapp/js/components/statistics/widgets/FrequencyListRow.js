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
import I18nWrapper from "../../../i18n/I18nWrapper";
import injectIntl from "../../../utils/injectIntl";
import {Line, LineChart, Tooltip, XAxis} from "recharts";
import Utils from "../Utils";

class FrequencyListRow extends React.Component {

    static propTypes = {
        // onClick: React.PropTypes.function,
        row: React.PropTypes.object.isRequired
    };

    constructor(props) {
        super(props);
    };

    onMouseClick(e) {
        e.preventDefault();
        this.props.onClick(this.props.row.eventTypeIri);
    };

    render() {
        const label = !(this.props.onClick) ?
            <div>{this.props.row.eventType}</div> :
            <a href='javascript:void(0);'
               onClick={(e) => this.onMouseClick(e)}
               title={this.props.row.eventTypeIri}>{this.props.row.eventType}
               </a>;


        return <tr key={this.props.row.key}>
            <td>{label}</td>
            <td>{this.props.row.totalSum}</td>
            <td><LineChart width={100} height={30} data={this.props.row.data}>
                <XAxis dataKey='date' hide={true} tickFormatter={Utils.getDateString}/>
                <Line type='basis' dataKey='count' stroke='#8884d8' strokeWidth={2} dot={false}/>
                <Tooltip labelFormatter={Utils.getDateString}/>
            </LineChart>
            </td>
        </tr>
    };
}

export default injectIntl(I18nWrapper(FrequencyListRow));