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
'use strict';

import React from "react";
import {Button} from "react-bootstrap";
import JsonLdUtils from "jsonld-utils";
import I18nWrapper from "../../../i18n/I18nWrapper";
import injectIntl from "../../../utils/injectIntl";
import ObjectTypeResolver from "../../../utils/ObjectTypeResolver";
import Utils from "../../../utils/Utils";
import Vocabulary from "../../../constants/Vocabulary";

const FactorRow = (props) => {
    const node = props.node,
        eventType = ObjectTypeResolver.resolveType(node.eventType, props.eventTypes),
        text = eventType ? JsonLdUtils.getJsonAttValue(eventType, Vocabulary.RDFS_LABEL) : node.eventType;
    return <tr>
        <td className='vertical-middle'>{text}</td>
        <td className='vertical-middle content-center'>{Utils.formatDate(node.startTime)}</td>
        <td className='vertical-middle content-center'>{Utils.formatDate(node.endTime)}</td>
        <td className='vertical-middle actions'>
            <Button bsStyle='primary' bsSize='small'
                    onClick={(e) => props.handlers.onDetails(node, text)}>{props.i18n('factors.detail.details')}</Button>
            <Button bsStyle='primary' bsSize='small'
                    onClick={(e) => props.handlers.onEdit(node)}>{props.i18n('table-edit')}</Button>
            <Button bsStyle='warning' bsSize='small'
                    onClick={(e) => props.handlers.onDelete(node)}>{props.i18n('delete')}</Button>
        </td>
    </tr>;
};

FactorRow.propTypes = {
    node: React.PropTypes.object.isRequired,
    eventTypes: React.PropTypes.array.isRequired,
    handlers: React.PropTypes.object.isRequired
};

export default injectIntl(I18nWrapper(FactorRow));
