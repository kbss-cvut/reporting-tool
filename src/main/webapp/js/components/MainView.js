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
import {MenuItem, Nav, Navbar, NavDropdown, NavItem} from "react-bootstrap";
import {LinkContainer} from "react-router-bootstrap";
import {IfGranted} from "react-authorization";

import Actions from "../actions/Actions";
import Authentication from "../utils/Authentication";
import Constants from "../constants/Constants";
import I18nStore from "../stores/I18nStore";
import I18nWrapper from "../i18n/I18nWrapper";
import injectIntl from "../utils/injectIntl";
import NavSearch from "./main/NavSearch"
import ProfileController from "./profile/ProfileController";
import UserStore from "../stores/UserStore";
import Vocabulary from "../constants/Vocabulary";

class MainView extends React.Component {

    constructor(props) {
        super(props);
        this.i18n = props.i18n;
        this.state = {
            showProfile: false
        };
    }

    componentWillMount() {
        I18nStore.setIntl(this.props.intl);
        this.unsubscribe = UserStore.listen(this._onUserLoaded);
    }

    componentWillUnmount() {
        this.unsubscribe();
    }

    _onUserLoaded = (data) => {
        if (data.action === Actions.loadUser)
            this.forceUpdate();
    };

    _openUserProfile = () => {
        this.setState({showProfile: true});
    };

    _closeUserProfile = () => {
        this.setState({showProfile: false});
    };

    render() {
        if (!UserStore.isLoaded()) {
            return <div>{this.props.children}</div>;
        }
        const user = UserStore.getCurrentUser();
        const name = user.firstName.substr(0, 1) + '. ' + user.lastName;
        return <div>
            <header>
                <Navbar fluid={true}>
                    <Navbar.Header>
                        <Navbar.Brand>{Constants.APP_NAME}</Navbar.Brand>
                    </Navbar.Header>
                    <Nav>
                        <LinkContainer
                            to='dashboard'><NavItem>{this.i18n('main.dashboard-nav')}</NavItem></LinkContainer>
                        <LinkContainer to='reports'><NavItem>{this.i18n('main.reports-nav')}</NavItem></LinkContainer>
                        <LinkContainer
                            to='statistics'><NavItem>{this.i18n('main.statistics-nav')}</NavItem></LinkContainer>
                        <IfGranted expected={Vocabulary.ROLE_ADMIN} actual={user.types} element='span'>
                            <LinkContainer to='admin'><NavItem>{this.i18n('main.admin-nav')}</NavItem></LinkContainer>
                        </IfGranted>
                    </Nav>
                    <Nav pullRight style={{margin: '0 -15px 0 0'}}>
                        <li>
                            <NavSearch/>
                        </li>
                        <NavDropdown id='logout' title={name}>
                            <MenuItem onClick={this._openUserProfile}>{this.i18n('main.user-profile')}</MenuItem>
                            <MenuItem divider/>
                            <MenuItem href='#' onClick={Authentication.logout}>{this.i18n('main.logout')}</MenuItem>
                        </NavDropdown>
                    </Nav>
                </Navbar>
            </header>
            <section style={{height: '100%'}}>
                <ProfileController show={this.state.showProfile} onClose={this._closeUserProfile}/>
                {this.props.children}
            </section>
        </div>;
    }
}

export default injectIntl(I18nWrapper(MainView));
