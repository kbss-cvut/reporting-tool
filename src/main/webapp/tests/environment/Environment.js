'use strict';

const React = require('react');
const ReactDOM = require('react-dom');
const TestUtils = require('react-addons-test-utils');
const rewire = require('rewire');

const Actions = require('../../js/actions/Actions');
const TestApp = require('./TestApp');

module.exports = {

    _currentRenderingResult: null,

    getCurrentRenderingResult: function () {
        return this._currentRenderingResult;
    },

    /**
     * Renders the specified component, wrapping it in a TestApp instance, which is used to initialize some required
     * context data, e.g. i18n.
     * @param component Component to render
     * @return {*|!ReactComponent} The rendered component
     */
    render: function (component) {
        let type = component.type,
            result = TestUtils.renderIntoDocument(<TestApp>{component}</TestApp>),
            renderedComponent = TestUtils.findRenderedComponentWithType(result, type);
        this._currentRenderingResult = result;
        if (renderedComponent.getWrappedInstance) {
            let wrapped = renderedComponent.getWrappedInstance();
            return wrapped.getWrappedComponent && wrapped.getWrappedComponent() ? wrapped.getWrappedComponent() : wrapped;
        } else {
            return renderedComponent;
        }
    },

    /**
     * Renders the specified component into a table body, wrapping it all in a TestApp instance, which is used to
     * initialize some required context data, e.g. i18n.
     *
     * This is useful for components representing table rows.
     * @param component Component to render
     * @return {*|!ReactComponent} The rendered component
     */
    renderIntoTable: function (component) {
        const type = component.type,
            result = TestUtils.renderIntoDocument(<TestApp>
                <table>
                    <tbody>{component}</tbody>
                </table>
            </TestApp>),
            renderedComponent = TestUtils.findRenderedComponentWithType(result, type);
        this._currentRenderingResult = result;
        if (renderedComponent.getWrappedInstance) {
            return renderedComponent.getWrappedInstance();
        } else {
            return renderedComponent;
        }
    },

    /**
     * Finds component with the specified text.
     * @param root Root of the tree where the component is searched for
     * @param component Component class
     * @param text Component text
     */
    getComponentByText: function (root, component, text) {
        const components = TestUtils.scryRenderedComponentsWithType(root, component);
        return this._getNodeByText(components, text, true);
    },

    _getNodeByText: function (components, text, strict) {
        for (let i = 0, len = components.length; i < len; i++) {
            const node = ReactDOM.findDOMNode(components[i]);
            if (strict && node.textContent === text) {
                return node;
            } else if (!strict && node.textContent.indexOf(text) !== -1) {
                return node;
            }
        }
        return null;
    },

    /**
     * Finds component with the specified text.
     *
     * This version searches components by tag, so it will catch also simple components like div.
     * @param root Root of the tree where the component is searched for
     * @param tag Tag name
     * @param text Component text
     */
    getComponentByTagAndText: function (root, tag, text) {
        const components = TestUtils.scryRenderedDOMComponentsWithTag(root, tag);
        return this._getNodeByText(components, text, true);
    },

    /**
     * Finds component which contains the specified text.
     *
     * This version searches components by tag, so it will catch also simple components like div.
     * @param root Root of the tree where the component is searched for
     * @param tag Tag name
     * @param text Text contained in the component's text content
     */
    getComponentByTagAndContainedText: function (root, tag, text) {
        const components = TestUtils.scryRenderedDOMComponentsWithTag(root, tag);
        return this._getNodeByText(components, text, false);
    },

    mockFactors: function (investigation) {
        const Factors = rewire('../../js/components/factor/Factors'),
            GanttController = jasmine.createSpyObj('GanttController', ['init', 'setScale', 'expandSubtree', 'updateOccurrenceEvent']),
            FactorRenderer = jasmine.createSpyObj('FactorRenderer', ['renderFactors']),
            FactorJsonSerializer = jasmine.createSpyObj('FactorJsonSerializer', ['getFactorGraph', 'setGanttController']);
        Factors.__set__('GanttController', GanttController);
        Factors.__set__('FactorRenderer', FactorRenderer);
        Factors.__set__('FactorJsonSerializer', FactorJsonSerializer);
        investigation.__set__('Factors', Factors);
    },

    /**
     * Creates a mock objects with the specified methods.
     *
     * The methods adhere to the builder pattern - they return the mock instance itself.
     * @param reqMockMethods array of methods to mock
     */
    mockRequestMethods: function (reqMockMethods) {
        const reqMock = jasmine.createSpyObj('request', reqMockMethods);
        for (let i = 0; i < reqMockMethods.length; i++) {
            // All mock methods just return the instance to adhere to the builder pattern implemented by request
            reqMock[reqMockMethods[i]].and.callFake(function () {
                return reqMock;
            });
        }
        return reqMock;
    },

    /**
     * Mocks the Logger, so that test console output is not polluted with log messages.
     */
    mockLogger: function () {
        return jasmine.createSpyObj('Logger', ['warn', 'log', 'error']);
    },

    /**
     * Mocks the Gantt component and sets in as global variable to simulate its ordinary behaviour.
     *
     * Returns the mock for possible further use.
     */
    mockGantt: function () {
        const gantt = jasmine.createSpyObj('gantt', ['init', 'open', 'addTask', 'addLink', 'getChildren', 'attachEvent', 'clearAll', 'render', 'calculateDuration']);
        gantt.config = {
            links: {}
        };
        gantt.templates = {};
        gantt.date = {};
        gantt.getChildren.and.callFake(() => {
            return [];
        });
        jasmine.getGlobal().gantt = gantt;
        return gantt;
    },

    /**
     * Returns true if the arrays are equal, i.e. they have the same size and contain the same elements.
     */
    arraysEqual: function (a, b) {
        if (a === b) return true;
        if (!a || !b) return false;
        if (a.length !== b.length) return false;

        for (let i = 0; i < a.length; ++i) {
            if (a[i] !== b[i]) {
                return false;
            }
        }
        return true;
    },

    /**
     * Binds store methods directly to actions to work around asynchronous processing of actions.
     * @param actionName Name of the action
     * @param store Store, the corresponding store method is found according to the usual onActionName scheme.
     */
    bindActionsToStoreMethods: function (actionName, store) {
        const fn = 'on' + actionName.charAt(0).toUpperCase() + actionName.substring(1);
        // For some reason, it didn't suffice (in some cases) to pass the store[fn] as argument to callFake, so that's
        // why the wrapping function is here
        spyOn(Actions, actionName).and.callFake(function () {
            store[fn].apply(store, arguments);
        });
    },

    /**
     * Custom Jasmine matchers
     */
    customMatchers: {

        toBeLexGreaterOrEqual: function (util, customEqualityTesters) {
            return {
                compare: function (actual, expected) {
                    if (expected === undefined) {
                        expected = '';
                    }
                    const result = {};
                    result.pass = actual.toUpperCase().localeCompare(expected.toUpperCase()) >= 0;
                    if (result.pass) {
                        result.message = 'Expected ' + actual + ' not to be lexicographically greater or equal to ' + expected;
                    } else {
                        result.message = 'Expected ' + actual + ' to be lexicographically greater or equal to ' + expected;
                    }
                    return result;
                }
            }
        },
        toBeLexGreaterThan: function (util, customEqualityTesters) {
            return {
                compare: function (actual, expected) {
                    if (expected === undefined) {
                        expected = '';
                    }
                    const result = {};
                    result.pass = actual.toUpperCase().localeCompare(expected.toUpperCase()) > 0;
                    if (result.pass) {
                        result.message = 'Expected ' + actual + ' not to be lexicographically greater than ' + expected;
                    } else {
                        result.message = 'Expected ' + actual + ' to be lexicographically greater than ' + expected;
                    }
                    return result;
                }
            }
        }
    }
};
