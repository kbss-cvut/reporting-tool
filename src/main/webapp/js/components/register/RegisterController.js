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
import React from "react";

import Actions from "../../actions/Actions";
import Ajax from "../../utils/Ajax";
import Constants from "../../constants/Constants";
import I18nStore from "../../stores/I18nStore";
import Logger from "../../utils/Logger";
import Register from "./Register";
import Routes from "../../utils/Routes";
import Routing from "../../utils/Routing";

export default class RegisterController extends React.Component {
    constructor(props) {
        super(props);
    }

    register = (user, onSuccess, onError) => {
        Ajax.post(Constants.REST_PREFIX + 'persons', user).end((body, resp) => {
            if (resp.status === 201) {
                onSuccess();
                this.doSyntheticLogin(user.username, user.password, onError);
            }
        }, (err) => {
            onError(err.message ? err.message : I18nStore.i18n('register.error'));
        });
    };

    /**
     * After successful registration, perform a synthetic login so that the user receives his session and can start
     * working.
     */
    doSyntheticLogin = (username, password, onError) => {
        Ajax.post('j_spring_security_check', null, 'form').send('username=' + username).send('password=' + password)
            .end((data, resp) => {
                const status = JSON.parse(resp.text);
                if (!status.success || !status.loggedIn) {
                    onError(I18nStore.i18n('register.login.error'));
                    return;
                }
                Actions.loadUser();
                Routing.transitionToHome();
            }, (err) => {
                Logger.error('Unable to perform synthetic login. Received response with status ' + err.status);
            });
    };

    cancel = () => {
        Routing.transitionTo(Routes.login);
    };

    render() {
        return <Register onRegister={this.register} onCancel={this.cancel}/>;
    }
}
