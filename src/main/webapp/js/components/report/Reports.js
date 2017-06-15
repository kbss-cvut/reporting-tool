'use strict';

import React from "react";
import {Button, Panel} from "react-bootstrap";
import FilterableReportsTable from "./FilterableReportsTable";
import I18nWrapper from "../../i18n/I18nWrapper";
import injectIntl from "../../utils/injectIntl";
import Mask from "../Mask";
import Routes from "../../utils/Routes";
import Routing from "../../utils/Routing";

class Reports extends React.Component {
    static propTypes = {
        allReports: React.PropTypes.array,
        reports: React.PropTypes.array,
        actions: React.PropTypes.object,
        filter: React.PropTypes.object
    };

    constructor(props) {
        super(props);
        this.i18n = props.i18n;
    }

    createReport = () => {
        Routing.transitionTo(Routes.createReport);
    };


    render() {
        if (this.props.reports === null) {
            return <Mask text={this.i18n('reports.loading-mask')}/>;
        }
        return <Panel header={<h3>{this.i18n('reports.panel-title')}</h3>} bsStyle='primary'>
            <FilterableReportsTable {...this.props}/>
            {this.renderNoReports()}
        </Panel>;
    }

    renderNoReports() {
        if (this.props.reports.length !== 0) {
            return <div>
                <Button bsStyle='primary' onClick={this.createReport}>{this.i18n('reports.create-report')}</Button>
            </div>;
        }
        if (this._areReportsFiltered()) {
            return <div className='no-reports-notice italics'>{this.i18n('reports.filter.no-matching-found')}</div>;
        } else {
            return <div className='no-reports-notice italics'>
                {this.i18n('reports.no-reports')}
                <a href='#' onClick={this.createReport} title={this.i18n('reports.no-reports.link-tooltip')}>
                    {this.i18n('reports.no-reports.link')}
                </a>
            </div>;
        }
    }

    _areReportsFiltered() {
        return this.props.reports.length !== this.props.allReports.length;
    }
}

export default injectIntl(I18nWrapper(Reports));
