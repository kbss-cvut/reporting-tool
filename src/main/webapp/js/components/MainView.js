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

var React = require('react');
var Reflux = require('reflux');

var Nav = require('react-bootstrap').Nav;
var Navbar = require('react-bootstrap').Navbar;
var NavBrand = require('react-bootstrap').NavbarBrand;
var NavItem = require('react-bootstrap').NavItem;
var NavDropdown = require('react-bootstrap').NavDropdown;
var MenuItem = require('react-bootstrap').MenuItem;
var LinkContainer = require('react-router-bootstrap').LinkContainer;
var injectIntl = require('../utils/injectIntl');

var Constants = require('../constants/Constants');
var I18nMixin = require('../i18n/I18nMixin');
var I18nStore = require('../stores/I18nStore');
var NavSearch = require('./main/NavSearch').default;

var Authentication = require('../utils/Authentication');
var UserStore = require('../stores/UserStore');

var MainView = React.createClass({
    mixins: [
        Reflux.listenTo(UserStore, 'onUserLoaded'),
        I18nMixin
    ],

    getInitialState: function () {
        return {
            loggedIn: UserStore.isLoaded()
        }
    },

    componentWillMount: function () {
        I18nStore.setIntl(this.props.intl);
    },

    onUserLoaded: function () {
        this.setState({loggedIn: true});
    },

    render: function () {
        if (!this.state.loggedIn) {
            return (<div>{this.props.children}</div>);
        }
        var user = UserStore.getCurrentUser();
        var name = user.firstName.substr(0, 1) + '. ' + user.lastName;
        return <div>
            <header>
                <Navbar fluid={true}>
                    <NavBrand className='navbrand-text'>{Constants.APP_NAME}</NavBrand>
                    <Nav>
                        <LinkContainer
                            to='dashboard'><NavItem>{this.i18n('main.dashboard-nav')}</NavItem></LinkContainer>
                        <LinkContainer
                            to='reports'><NavItem>{this.i18n('main.reports-nav')}</NavItem></LinkContainer>
                        <LinkContainer
                            to='statistics'><NavItem>{this.i18n('main.statistics-nav')}</NavItem></LinkContainer>
                    </Nav>
                    <Nav pullRight style={{margin: '0 -15px 0 0'}}>
                        <li>
                            <NavSearch/>
                        </li>
                        <NavDropdown id='logout' title={name}>
                            <MenuItem href='#' onClick={Authentication.logout}>{this.i18n('main.logout')}</MenuItem>
                        </NavDropdown>
                    </Nav>
                </Navbar>
            </header>
            <section style={{height: '100%'}}>
                {this.props.children}
            </section>
        </div>;
    }
});

module.exports = injectIntl(MainView);
