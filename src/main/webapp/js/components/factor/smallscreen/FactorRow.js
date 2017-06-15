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
        <td className='report-row'>{text}</td>
        <td className='report-row content-center'>{Utils.formatDate(node.startTime)}</td>
        <td className='report-row content-center'>{Utils.formatDate(node.endTime)}</td>
        <td className='report-row actions'>
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
