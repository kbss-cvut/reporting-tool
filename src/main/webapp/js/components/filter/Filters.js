'use strict';

import React from "react";
import {Button, ButtonToolbar} from "react-bootstrap";
import JsonLdUtils from "jsonld-utils";
import Actions from "../../actions/Actions";
import Constants from "../../constants/Constants";
import I18nWrapper from "../../i18n/I18nWrapper";
import injectIntl from "../../utils/injectIntl";
import OptionsStore from "../../stores/OptionsStore";
import Select from "../Select";
import Utils from "../../utils/Utils";

function _processFilters(func) {
    for (var i = 0, len = Constants.FILTERS.length; i < len; i++) {
        func(Constants.FILTERS[i]);
    }
}

function _resolveUniqueFilterableValues(data) {
    var values = {}, item;
    _processFilters((filter) => {
        values[filter.path] = [];
    });
    for (var i = 0, len = data.length; i < len; i++) {
        item = data[i];
        ((item) => {
            _processFilters((filter) => {
                var value = Utils.getPropertyValue(item, filter.path);
                if (Array.isArray(value)) {
                    for (var j = 0, lenn = value.length; j < lenn; j++) {
                        if (values[filter.path].indexOf(value[j]) === -1) {
                            values[filter.path].push(value[j]);
                        }
                    }
                } else if (value && values[filter.path].indexOf(value) === -1) {
                    values[filter.path].push(value);
                }
            });
        })(item);
    }
    return values;
}

class Filters extends React.Component {
    static propTypes = {
        filters: React.PropTypes.object.isRequired,
        data: React.PropTypes.array.isRequired,
        onChange: React.PropTypes.func.isRequired,
        onResetFilters: React.PropTypes.func.isRequired
    };

    constructor(props) {
        super(props);
        this.i18n = props.i18n;
        this.state = this._generateOptions();
    }

    _generateOptions() {
        var data = this.props.data,
            values = _resolveUniqueFilterableValues(data),
            newState = {};

        _processFilters((filter) => {
            newState[filter.options] = [this._getDefaultFilterOption()];
            if (!values[filter.path] || filter.type !== 'select') {
                return;
            }
            var options = OptionsStore.getOptions(filter.options);
            for (var i = 0, len = options.length; i < len; i++) {
                for (var j = 0, lenn = values[filter.path].length; j < lenn; j++) {
                    if (options[i]['@id'] === values[filter.path][j]) {
                        newState[filter.options].push(JsonLdUtils.jsonLdToSelectOption(options[i], this.props.intl));
                    }
                }
            }
        });
        return newState;
    }

    _getDefaultFilterOption() {
        return {value: Constants.FILTER_DEFAULT, label: this.i18n('reports.filter.type.all')};
    }

    componentDidMount() {
        this.unsubscribe = OptionsStore.listen(this._onOptionsLoaded);
        _processFilters((filter) => {
            if (filter.options) {
                Actions.loadOptions(filter.options);
            }
        });
    }

    _onOptionsLoaded = (type) => {
        if (this.state[type]) {
            this.setState(this._generateOptions());
        }
    };

    componentWillUnmount() {
        this.unsubscribe();
    }

    _onOptionSelected = (e) => {
        var change = {};
        change[e.target.name] = e.target.value;
        this.props.onChange(change);
    };

    _onResetFilters = () => {
        var reset = {};
        Object.getOwnPropertyNames(this.props.filters).forEach(prop => {
            reset[prop] = Constants.FILTER_DEFAULT
        });
        this.props.onResetFilters(reset);
    };

    render() {
        return <div>
            <div>
                {this._renderFilters()}
            </div>
            <div className='row filters-footer'>
                <ButtonToolbar className='float-right'>
                    <Button bsSize='small' bsStyle='primary'
                            onClick={this._onResetFilters}>{this.i18n('reports.filter.reset')}</Button>
                </ButtonToolbar>
            </div>
        </div>;
    }

    _renderFilters() {
        var filters = [];
        _processFilters((filter) => {
            if (filter.type === 'select') {
                if (this.state[filter.options].length === 0) {
                    return;
                }
                filters.push(<div className='row' key={filter.path}>
                    <div className='col-xs-12'>
                        <Select label={this.i18n(filter.label)} name={filter.path} options={this.state[filter.options]}
                                value={this.props.filters[filter.path]} onChange={this._onOptionSelected}/>
                    </div>
                </div>);
            }
        });
        return filters;
    }
}

export default injectIntl(I18nWrapper(Filters));
