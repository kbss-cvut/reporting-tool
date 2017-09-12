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
import Actions from "../../actions/Actions";
import SearchResults from "./SearchResults";
import SearchStore from "../../stores/SearchStore";

export default class SearchResultController extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            expression: props.location.query.expression,
            loading: false,
            data: []
        };
    }

    componentDidMount() {
        Actions.fullTextSearch(this.state.expression);
        this.setState({loading: true});
        this.unsubscribe = SearchStore.listen(this._onSearchFinished);
    }

    _onSearchFinished = (data) => {
        if (data.action === Actions.fullTextSearch) {
            this.setState({loading: false});
            this.setState({data: data.data.results.bindings});
        }
    };

    componentWillUnmount() {
        this.unsubscribe();
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.location.query.expression !== this.state.expression) {
            this.setState({expression: nextProps.location.query.expression});
            Actions.fullTextSearch(nextProps.location.query.expression);
            this.setState({loading: true});
        }
    }

    render() {
        if (this.state.expression.length === 0) {
            return null;
        }
        return <SearchResults expression={this.state.expression} results={this.state.data}
                              loading={this.state.loading}/>;
    }
}
