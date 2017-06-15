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
