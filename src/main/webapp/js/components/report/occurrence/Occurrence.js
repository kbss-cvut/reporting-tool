'use strict';

import React from "react";
import DateTimePicker from "react-bootstrap-datetimepicker";
import assign from "object-assign";

import Constants from "../../../constants/Constants";
import I18nWrapper from "../../../i18n/I18nWrapper";
import injectIntl from "../../../utils/injectIntl";
import Input from "../../Input";

class Occurrence extends React.Component {

    static propTypes = {
        report: React.PropTypes.object.isRequired,
        onChange: React.PropTypes.func.isRequired
    };

    constructor(props) {
        super(props);
        this.i18n = props.i18n;
        this.state = {
            startTimeChanged: false
        };
    }

    onChange = (e) => {
        const occurrence = assign({}, this.props.report.occurrence);
        occurrence[e.target.name] = e.target.value;
        this.props.onChange({'occurrence': occurrence});
    };

    onStartChange = (value) => {
        if (isNaN(value)) {
            return;
        }
        const occurrence = assign({}, this.props.report.occurrence),
            timeDiff = occurrence.startTime - Number(value);
        occurrence.startTime = Number(value);
        if (this.props.report.isNew && !this.state.startTimeChanged) {
            occurrence.endTime = Number(value) + Constants.MINUTE;
            this.setState({startTimeChanged: true});
        } else {
            occurrence.endTime = occurrence.endTime - timeDiff;
        }
        this.props.onChange({'occurrence': occurrence});
    };

    onEndChange = (value) => {
        if (isNaN(value)) {
            return;
        }
        const occurrence = assign({}, this.props.report.occurrence);
        occurrence.endTime = Number(value);
        this.props.onChange({'occurrence': occurrence});
    };

    render() {
        const report = this.props.report;
        return <div>
            <div className='row'>
                <div className='col-xs-4'>
                    <Input type='text' name='name' value={report.occurrence.name} onChange={this.onChange}
                           label={this.i18n('headline') + '*'}
                           title={this.i18n('occurrence.headline-tooltip')}/>
                </div>
            </div>

            <div className='row'>
                <div className='picker-container form-group form-group-sm col-xs-2'>
                    <label className='control-label' title={this.i18n('occurrence.start-time-tooltip')}>
                        {this.i18n('occurrence.start-time')}
                    </label>
                    <DateTimePicker inputFormat='DD-MM-YYYY' dateTime={report.occurrence.startTime.toString()}
                                    onChange={this.onStartChange} size='small' mode='date'
                                    inputProps={{title: this.i18n('occurrence.start.date-tooltip')}}/>
                </div>
                <div className='picker-container form-group form-group-sm col-xs-2'>
                    <label className='control-label'>&nbsp;</label>
                    <DateTimePicker inputFormat='HH:mm:ss' dateTime={report.occurrence.startTime.toString()}
                                    onChange={this.onStartChange} size='small' mode='time'
                                    inputProps={{title: this.i18n('occurrence.start.time-tooltip')}}/>
                </div>
                <div className='picker-container form-group form-group-sm col-xs-2'>
                    <label className='control-label' title={this.i18n('occurrence.end-time-tooltip')}>
                        {this.i18n('occurrence.end-time')}
                    </label>
                    <DateTimePicker inputFormat='DD-MM-YYYY' dateTime={report.occurrence.endTime.toString()}
                                    onChange={this.onEndChange} size='small' mode='date'
                                    inputProps={{title: this.i18n('occurrence.end.date-tooltip')}}/>
                </div>
                <div className='picker-container form-group form-group-sm col-xs-2'>
                    <label className='control-label'>&nbsp;</label>
                    <DateTimePicker inputFormat='HH:mm:ss' dateTime={report.occurrence.endTime.toString()}
                                    onChange={this.onEndChange} size='small' mode='time'
                                    inputProps={{title: this.i18n('occurrence.end.time-tooltip')}}/>
                </div>
            </div>
        </div>;
    }
}

export default injectIntl(I18nWrapper(Occurrence));
