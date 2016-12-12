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
import Typeahead from "react-bootstrap-typeahead";
import Actions from "../../actions/Actions";
import Constants from "../../constants/Constants";
import I18nWrapper from "../../i18n/I18nWrapper";
import injectIntl from "../../utils/injectIntl";
import ReportType from "../../model/ReportType";
import ReportStore from "../../stores/ReportStore";
import Routes from "../../utils/Routes";
import Routing from "../../utils/Routing";
import ReportSearchResultList from "../typeahead/ReportSearchResultList";
import Utils from "../../utils/Utils";

const OPTION_IDENTIFICATION_THRESHOLD = 45;

class NavSearch extends React.Component {
    constructor(props) {
        super(props);
        this.i18n = props.i18n;
        this.state = {
            options: NavSearch._processReports(ReportStore.getReportsForSearch()),
            fullTextDisabled: true
        }
    }

    componentDidMount() {
        if (this.state.options.length === 0) {
            Actions.loadReportsForSearch();
        }
        this.unsubscribe = ReportStore.listen(this._onReportsLoaded);
    }

    componentWillUnmount() {
        this.unsubscribe();
    }

    _onReportsLoaded = (data) => {
        if (data.action !== Actions.loadReportsForSearch) {
            return;
        }
        this.setState({options: NavSearch._processReports(data.reports)});
    };

    static _processReports(reports) {
        if (!reports) {
            return [];
        }
        const options = [];
        let option;
        for (let i = 0, len = reports.length; i < len; i++) {
            option = ReportType.getReport(reports[i]);
            option.description = option.identification;
            options.push(option);
        }
        return options;
    }

    _onOptionSelected = (option) => {
        if (option === Constants.FULL_TEXT_SEARCH_OPTION) {
            this._onFullTextSearch();
        } else {
            Routing.transitionTo(Routes.editReport, {
                params: {reportKey: option.key},
                handlers: {onCancel: Routes.reports}
            });
        }
        this.typeahead.setEntryText('');
    };

    _onSearchTextChange = (e) => {
        this.setState({fullTextDisabled: e.target.value.length === 0});
    };

    _onFullTextSearch = () => {
        const expr = this.typeahead.getEntryText();
        Routing.transitionTo(Routes.searchResults, {
            query: "?expression=" + encodeURIComponent(expr)
        });
        this.typeahead.setEntryText('');
    };

    render() {
        const classes = {
                input: 'navbar-search-input',
                results: 'navbar-search-results list-unstyled'
            },
            optionLabel = this._getOptionLabelFunction();

        return <Typeahead ref={(c) => this.typeahead = c} size='small' name={this.props.name}
                          formInputOption='id' className='navbar-search'
                          placeholder={this.i18n('main.search-placeholder')}
                          onOptionSelected={this._onOptionSelected} onChange={this._onSearchTextChange}
                          filterOption='identification'
                          displayOption={optionLabel} options={this.state.options}
                          customClasses={classes}
                          customListComponent={ReportSearchResultList}/>;
    }

    _getOptionLabelFunction() {
        return function (option) {
            const date = option.date ? Utils.formatDate(new Date(option.date)) : '',
                label = option.identification.length > OPTION_IDENTIFICATION_THRESHOLD ?
                option.identification.substring(0, OPTION_IDENTIFICATION_THRESHOLD) + '...' : option.identification;

            return label + ' (' + date + ')';
        }.bind(this);
    }
}

export default injectIntl(I18nWrapper(NavSearch));
