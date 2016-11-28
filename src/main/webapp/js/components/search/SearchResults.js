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
import {Panel, Table} from "react-bootstrap";
import {FormattedMessage} from "react-intl";
import I18nWrapper from "../../i18n/I18nWrapper";
import injectIntl from "../../utils/injectIntl";
import Mask from "../Mask";
import Routes from "../../utils/Routes";

class SearchResults extends React.Component {
    static propTypes = {
        expression: React.PropTypes.string.isRequired,
        results: React.PropTypes.array.isRequired,
        loading: React.PropTypes.bool
    };

    static defaultProps = {
        loading: true
    };

    constructor(props) {
        super(props);
        this.i18n = props.i18n;
    }

    render() {
        if (this.props.loading) {
            return <Mask text={this.i18n('search.loading')}/>;
        }
        return <Panel header={<h3>{this.i18n('search.title')}</h3>} bsStyle='primary'>
            <h4>
                <FormattedMessage id='search.headline' values={{
                    expression: '\'' + this.props.expression + '\'',
                    count: this.props.results.length
                }}/>
            </h4>
            {this._renderResults()}
        </Panel>;
    }

    _renderResults() {
        if (this.props.results.length === 0) {
            return null;
        }
        return <Table striped condensed hover>
            <thead>
            <tr>
                <th className='col-xs-4 content-center'>{this.i18n('headline')}</th>
                <th className='col-xs-8 content-center'>{this.i18n('search.results.match')}</th>
            </tr>
            </thead>
            <tbody>
            {this._renderResultRows()}
            </tbody>
        </Table>
    }

    _renderResultRows() {
        var results = this.props.results,
            rows = [];
        for (var i = 0, len = results.length; i < len; i++) {
            rows.push(<SearchResultRow key={'search-result-' + i} record={results[i]}/>);
        }
        return rows;
    }
}

var SearchResultRow = (props) => {
    var key = props.record['key']['value'],
        headline = props.record['headline']['value'],
        snippet = props.record['snippet']['value'];
    return <tr>
        <td className='report-row'><a href={'#/' + Routes.reports.path + '/' + key}
                                      title={props.i18n('reports.open-tooltip')}>{headline}</a>
        </td>
        <td className='report-row'>
            <div dangerouslySetInnerHTML={{__html: snippet}}/>
        </td>
    </tr>;
};

SearchResultRow.propTypes = {
    record: React.PropTypes.object.isRequired
};

SearchResultRow = injectIntl(I18nWrapper(SearchResultRow));

export default injectIntl(I18nWrapper(SearchResults));
