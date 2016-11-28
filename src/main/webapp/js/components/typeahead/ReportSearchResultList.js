'use strict';

import React from "react";
import classNames from "classnames";
import {Label} from "react-bootstrap";
import Constants from "../../constants/Constants";
import I18nStore from "../../stores/I18nStore";

const ResultListItem = (props) => {
    var option = props.option,
        label = typeof props.displayOption === 'function' ? props.displayOption(option) : option[props.displayOption];

    return <li className='btn-link item' title={option.description} onClick={props.onClick}>
        <Label className='item-label'>{I18nStore.i18n(option.getPrimaryLabel())}</Label>
        {label}
    </li>;
};

ResultListItem.propTypes = {
    option: React.PropTypes.object.isRequired,
    displayOption: React.PropTypes.oneOfType([React.PropTypes.string, React.PropTypes.func]).isRequired,
    onClick: React.PropTypes.func.isRequired
};

class ReportSearchResultList extends React.Component {
    static propTypes = {
        options: React.PropTypes.array.isRequired,
        customClasses: React.PropTypes.object.isRequired,
        onOptionSelected: React.PropTypes.func.isRequired,
        displayOption: React.PropTypes.oneOfType([React.PropTypes.string, React.PropTypes.func]).isRequired
    };

    constructor(props) {
        super(props);
    }

    _onClick(option, evt) {
        evt.preventDefault();
        this.props.onOptionSelected(option);
    }

    render() {
        var options = this.props.options,
            listCls = classNames({
                'autocomplete-results': options.length < 21,
                'autocomplete-results extended': options.length >= 21
            }, this.props.customClasses.results);
        var items = [];
        items.push(this._renderFullTextSearchOption());
        for (var i = 0, len = options.length; i < len; i++) {
            const option = options[i];
            var onClick = this._onClick.bind(this, option);
            items.push(<ResultListItem option={option} displayOption={this.props.displayOption} onClick={onClick}
                                       key={'option-' + i}/>);
        }
        return <ul className={listCls}>
            {items}
        </ul>;
    }

    _renderFullTextSearchOption() {
        return <li key='full-text-search' className='btn-link item fulltext'
                   title={I18nStore.i18n('main.search.fulltext-tooltip')}
                   onClick={(e) => this._onClick(Constants.FULL_TEXT_SEARCH_OPTION, e)}>
            <Label className='item-label'>{I18nStore.i18n('main.search.fulltext.label')}</Label>
            {I18nStore.i18n('main.search.fulltext')}
        </li>;
    }
}

export default ReportSearchResultList;
