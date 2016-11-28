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
import {Label} from "react-bootstrap";
import FactorStyleInfo from "../../utils/FactorStyleInfo";

const ResultListItem = (props) => {
    var option = props.option,
        label = typeof props.displayOption === 'function' ? props.displayOption(option) : option[props.displayOption],
        styleInfo = FactorStyleInfo.getStyleInfo(option.type);

    return <li className='btn-link item' title={option.description} onClick={props.onClick}>
        {styleInfo.value ?
            <Label bsStyle={styleInfo.bsStyle} title={styleInfo.title}
                   className='autocomplete-results-item'>{styleInfo.value}</Label> : null}
        {label}
    </li>;
};

ResultListItem.propTypes = {
    option: React.PropTypes.object.isRequired,
    displayOption: React.PropTypes.oneOfType([React.PropTypes.string, React.PropTypes.func]).isRequired,
    onClick: React.PropTypes.func.isRequired
};

class EventTypeTypeaheadResultList extends React.Component {
    static propTypes = {
        options: React.PropTypes.array.isRequired,
        customClasses: React.PropTypes.object.isRequired,
        onOptionSelected: React.PropTypes.func.isRequired,
        displayOption: React.PropTypes.oneOfType([React.PropTypes.string, React.PropTypes.func]).isRequired
    };

    constructor(props) {
        super(props);
    }

    _onClick(option, evt) {
        evt.preventDefault();
        this.props.onOptionSelected(option);
    }

    render() {
        var options = this.props.options,
            listCls = options.length < 21 ? 'autocomplete-results event-type' : 'autocomplete-results extended event-type';
        if (this.props.customClasses.results) {
            listCls += ' ' + this.props.customClasses.results;
        }
        var items = [];
        for (var i = 0, len = options.length; i < len; i++) {
            const option = options[i];
            var onClick = this._onClick.bind(this, option);
            items.push(<ResultListItem option={option} displayOption={this.props.displayOption} onClick={onClick}
                                       key={'option-' + i}/>);
        }
        return <ul className={listCls}>
            {items}
        </ul>;
    }
}

export default EventTypeTypeaheadResultList;
