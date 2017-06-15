'use strict';

describe('Paging mixin', function () {

    var PagingMixin = require('../../js/components/mixin/PagingMixin'),
        Actions = require('../../js/actions/Actions'),
        ComponentStateStore = require('../../js/stores/ComponentStateStore'),
        defaultPageSize;

    beforeEach(function () {
        PagingMixin.props = PagingMixin.getDefaultProps();
        PagingMixin.state = PagingMixin.getInitialState();
        defaultPageSize = PagingMixin.props.pageSize;
        spyOn(Actions, 'rememberComponentState');
    });

    it('renders buttons corresponding to page count', function () {
        var data = generateData(13),
            expectedPageCount = 3;

        PagingMixin.props.pageSize = 5;
        var result = PagingMixin.renderPagination(data);
        expect(result.props.children[0].props.items).toEqual(expectedPageCount);
    });

    function generateData(count) {
        var data = [];
        for (var i = 0; i < count; i++) {
            data.push({id: i, name: 'Item-' + i});
        }
        return data;
    }

    it('does not render any pagination when data fits one page', function () {
        var data = generateData(defaultPageSize - 1),
            result = PagingMixin.renderPagination(data);
        expect(typeof result.props.children).toEqual('object');
        expect(result.props.children.props.className).toEqual('paging-item-count-info');
    });

    it('returns data for first page when it is active', function () {
        var data = generateData(defaultPageSize * 2),
            result = PagingMixin.getCurrentPage(data);
        expect(PagingMixin.state.activePage).toEqual(1);
        expect(result).toEqual(data.slice(0, PagingMixin.props.pageSize));
    });

    it('returns data corresponding to active pages', function () {
        var data = generateData(defaultPageSize * 4),
            pageSize = 5;
        PagingMixin.props.pageSize = pageSize;
        for (var i = 0, len = data.length; i < len; i += pageSize) {
            expect(PagingMixin.getCurrentPage(data)).toEqual(data.slice(i, i + pageSize));
            PagingMixin.state.activePage += 1;
        }
    });

    it('returns data remainder when data size is not divisible by page size', function () {
        var data = generateData(defaultPageSize + defaultPageSize - 1);
        PagingMixin.state.activePage += 1;
        expect(PagingMixin.getCurrentPage(data)).toEqual(data.slice(defaultPageSize));
    });

    it('resets pagination to the first page', function () {
        var data = generateData(defaultPageSize * 3);
        PagingMixin.setState = function (newState) {
            PagingMixin.state = newState;
        };
        PagingMixin.state.activePage += 1;
        expect(PagingMixin.getCurrentPage(data)).toEqual(data.slice(PagingMixin.props.pageSize, PagingMixin.props.pageSize * 2));
        PagingMixin.resetPagination();
        expect(PagingMixin.state.activePage).toEqual(1);
        expect(PagingMixin.getCurrentPage(data)).toEqual(data.slice(0, PagingMixin.props.pageSize));
    });

    it('returns all data when it fits in one page', function () {
        var data = generateData(defaultPageSize);
        expect(PagingMixin.getCurrentPage(data)).toEqual(data);
    });

    it('renders correct item count when all items fit page', () => {
        var data = generateData(defaultPageSize - 1),
            result = PagingMixin.renderPagination(data);
        var itemCount = result.props.children.props.children.props['values']['showing'];
        var totalCount = result.props.children.props.children.props['values']['total'];
        expect(totalCount).toEqual(data.length);
        expect(itemCount).toEqual(totalCount);
    });

    it('renders correct item count when multiple pages are necessary', () => {
        var data = generateData(defaultPageSize + defaultPageSize - 1),
            result = PagingMixin.renderPagination(data);
        var itemCount = result.props.children[1].props.children.props['values']['showing'];
        var totalCount = result.props.children[1].props.children.props['values']['total'];
        expect(itemCount).toEqual(defaultPageSize);
        expect(totalCount).toEqual(data.length);
    });

    it('renders correct item count when rest of data are shown in last page', () => {
        var data = generateData(defaultPageSize + defaultPageSize - 1),
            result;
        PagingMixin.state.activePage += 1;
        result = PagingMixin.renderPagination(data);
        var itemCount = result.props.children[1].props.children.props['values']['showing'];
        var totalCount = result.props.children[1].props.children.props['values']['total'];
        expect(itemCount).toEqual(defaultPageSize - 1);
        expect(totalCount).toEqual(data.length);
    });

    it('remembers paging for component when page is selected', () => {
        var selectedPage = PagingMixin.state.activePage + 1,
            displayName = 'ReportsTable';
        PagingMixin.getDisplayName = jasmine.createSpy('getDisplayName');
        PagingMixin.getDisplayName.and.returnValue(displayName);
        PagingMixin._onPageSelect({}, {
            eventKey: selectedPage
        });
        expect(Actions.rememberComponentState).toHaveBeenCalledWith(displayName, PagingMixin.state);
    });

    it('calls paging change callback when paging is reset', () => {
        var displayName = 'ReportsTable';
        PagingMixin.getDisplayName = jasmine.createSpy('getDisplayName');
        PagingMixin.getDisplayName.and.returnValue(displayName);
        PagingMixin.resetPagination();
        expect(Actions.rememberComponentState).toHaveBeenCalledWith(displayName, PagingMixin.getInitialState());
    });

    it('uses default active page when no initial state is remembered in ComponentStateStore', () => {
        var displayName = 'ReportsTable';
        PagingMixin.getDisplayName = jasmine.createSpy('getDisplayName');
        PagingMixin.getDisplayName.and.returnValue(displayName);
        expect(PagingMixin.getInitialState()).toEqual({activePage: 1});
    });

    it('uses remembered paging state when it is available in ComponentStateStore', () => {
        var page = 2,
            displayName = 'ReportsTable';
        spyOn(ComponentStateStore, 'getComponentState').and.returnValue({activePage: page});
        PagingMixin.getDisplayName = jasmine.createSpy('getDisplayName');
        PagingMixin.getDisplayName.and.returnValue(displayName);
        expect(PagingMixin.getInitialState()).toEqual({activePage: page});
        expect(ComponentStateStore.getComponentState).toHaveBeenCalledWith(displayName);
    });
});
