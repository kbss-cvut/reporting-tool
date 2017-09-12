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
var React = require('react');
var Pagination = require('react-bootstrap').Pagination;

var FormattedMessage = require('react-intl').FormattedMessage;

var Actions = require('../../actions/Actions');
var Constants = require('../../constants/Constants');
var ComponentStateStore = require('../../stores/ComponentStateStore');

var MAX_BUTTONS = 5;

/**
 * Mixin for data paging in tables.
 *
 * It is completely self-contained and provides methods which:
 * <ul>
 *     <li>Render the pagination component when necessary (when data don't fit one page)</li>
 *     <li>Return portion of data corresponding to the currently active page</li>
 * </ul>
 */
var PagingMixin = {

    propTypes: {
        pageSize: React.PropTypes.number,
        maxButtons: React.PropTypes.number
    },

    getDefaultProps: function () {
        return {
            pageSize: Constants.PAGE_SIZE,
            maxButtons: MAX_BUTTONS
        }
    },

    getInitialState: function () {
        var page = 1;
        if (this.getDisplayName) {
            var state = ComponentStateStore.getComponentState(this.getDisplayName());
            if (state && state.activePage) {
                page = state.activePage;
            }
        }
        return {activePage: page};
    },

    _onPageSelect: function (page) {
        this.setState({activePage: page});
        if (this.getDisplayName) {
            Actions.rememberComponentState(this.getDisplayName(), {activePage: page});
        }
    },

    /**
     * Resets pagination to defaults.
     */
    resetPagination: function () {
        this.setState(this.getInitialState());
        if (this.getDisplayName) {
            Actions.rememberComponentState(this.getDisplayName(), this.getInitialState());
        }
    },

    /**
     * Assuming that the data is an array, this function returns a sub-array of the data corresponding to the currently
     * active page.
     * @param data array of data
     */
    getCurrentPage: function (data) {
        var startIndex = this.props.pageSize * (this.state.activePage - 1),
            endIndex = startIndex + this.props.pageSize > data.length ? data.length : startIndex + this.props.pageSize;
        return data.slice(startIndex, endIndex);
    },

    _renderCountInfo: function (data) {
        var currentItemCnt = this.getCurrentPage(data).length;
        return <div className='paging-item-count-info'>
            <FormattedMessage id='reports.paging.item-count' values={{showing: currentItemCnt, total: data.length}}/>
        </div>;
    },

    /**
     * Renders the pagination component.
     *
     * If the data fits one page, {@code null} is returned, as there is no need for paging.
     * @param data The data that will be shown and need paging
     */
    renderPagination: function (data) {
        var itemCount = Math.ceil(data.length / this.props.pageSize);
        if (itemCount === 1) {
            return <div>
                {this._renderCountInfo(data)}
            </div>;
        }
        return <div>
            <Pagination
                prev next first last ellipsis boundaryLinks items={itemCount} maxButtons={this.props.maxButtons}
                activePage={this.state.activePage} onSelect={this._onPageSelect}/>
            {this._renderCountInfo(data)}
        </div>;
    }
};

module.exports = PagingMixin;
