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

const OPTION_IDENTIFICATION_THRESHOLD = 65;

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
            option.description = option.date ? '(' + Utils.formatDate(option.date) + ') - ' : '';
            option.description += option.identification;
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
            return option.identification.length > OPTION_IDENTIFICATION_THRESHOLD ?
                option.identification.substring(0, OPTION_IDENTIFICATION_THRESHOLD) + '...' : option.identification;
        }.bind(this);
    }
}

export default injectIntl(I18nWrapper(NavSearch));
