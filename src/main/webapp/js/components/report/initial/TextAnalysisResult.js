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
import PropTypes from "prop-types";
import {Label} from "react-bootstrap";
import I18nWrapper from "../../../i18n/I18nWrapper";
import injectIntl from "../../../utils/injectIntl";

class TextAnalysisResult extends React.Component {
    static propTypes = {
        items: PropTypes.array
    };

    static defaultProps = {
        items: []
    };

    constructor(props) {
        super(props);
        this.i18n = props.i18n;
    }

    render() {
        const items = this.props.items,
            labels = [];
        for (let b = 0; b < this.props.items.length; b++) {
            labels.push(<a key={items[b].label + '-' + items[b].resource} href={items[b].resource}
                           className='text-analysis-result' target='_blank'>
                <Label>
                    {items[b].label}
                </Label>
            </a>);
        }
        return <div>
            <label className='control-label'>{this.i18n('report.initial.analysis-results.label')}</label>
            <div style={{width: '100%', minHeight: '50px', maxHeight: '150px', overflow: 'auto'}}>
                <div style={{width: '100%', display: 'table-cell'}}>
                    {labels}
                </div>
            </div>
        </div>;
    }

}

export default injectIntl(I18nWrapper(TextAnalysisResult));