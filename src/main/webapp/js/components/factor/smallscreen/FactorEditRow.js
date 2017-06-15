'use strict';

import React from "react";
import {Button} from "react-bootstrap";
import DateTimePicker from "react-bootstrap-datetimepicker";
import JsonLdUtils from "jsonld-utils";
import assign from "object-assign";
import Constants from "../../../constants/Constants";
import EventTypeTypeahead from "../../typeahead/EventTypeTypeahead";
import I18nWrapper from "../../../i18n/I18nWrapper";
import injectIntl from "../../../utils/injectIntl";
import ObjectTypeResolver from "../../../utils/ObjectTypeResolver";
import OptionsStore from "../../../stores/OptionsStore";
import Vocabulary from "../../../constants/Vocabulary";

class FactorEditRow extends React.Component {
    static propTypes = {
        factor: React.PropTypes.object.isRequired,
        handlers: React.PropTypes.object.isRequired
    };

    constructor(props) {
        super(props);
        this.i18n = props.i18n;
        this.state = {
            factor: assign({}, props.factor)
        };
    }

    _onEventTypeSelected = (et) => {
        const update = assign({}, this.state.factor);
        update.eventType = et.id;
        this.setState({factor: update});
    };

    _onStartChange = (date) => {
        const update = assign({}, this.state.factor);
        update.startTime = Number(date);
        this.setState({factor: update});
    };

    _onEndChange = (date) => {
        const update = assign({}, this.state.factor);
        update.endTime = Number(date);
        this.setState({factor: update});
    };

    _onSave = () => {
        this.props.handlers.onSave(this.state.factor);
    };

    render() {
        const factor = this.state.factor,
            eventType = ObjectTypeResolver.resolveType(factor.eventType, OptionsStore.getOptions(Constants.OPTIONS.EVENT_TYPE)),
            eventTypeLabel = eventType ? JsonLdUtils.getJsonAttValue(eventType, Vocabulary.RDFS_LABEL) : factor.eventType;
        return <tr>
            <td className='report-row content-center inline'>
                <EventTypeTypeahead value={eventTypeLabel} focus={true} onSelect={this._onEventTypeSelected}/>
            </td>
            <td className='picker-container report-row content-center inline'>
                <DateTimePicker inputFormat='DD-MM-YY HH:mm:ss' dateTime={factor.startTime.toString()}
                                onChange={this._onStartChange} size='small'
                                inputProps={{
                                    title: this.i18n('occurrence.start-time-tooltip'),
                                    className: 'inline-input',
                                    size: 12
                                }}/>
            </td>
            <td className='picker-container report-row content-center inline'>
                <DateTimePicker inputFormat='DD-MM-YY HH:mm:ss' dateTime={factor.endTime.toString()}
                                onChange={this._onEndChange} size='small'
                                inputProps={{
                                    title: this.i18n('occurrence.end-time-tooltip'),
                                    className: 'inline-input',
                                    size: 12
                                }}/>
            </td>
            <td className="report-row actions">
                <Button bsStyle='success' bsSize='small' onClick={this._onSave}>{this.i18n('save')}</Button>
                <Button bsSize='small' onClick={this.props.handlers.onEditCancel}>{this.i18n('cancel')}</Button>
            </td>
        </tr>;
    }
}

export default injectIntl(I18nWrapper(FactorEditRow));
