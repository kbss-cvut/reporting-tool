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
import Actions from "../actions/Actions";
import Ajax from "./Ajax";
import Logger from "./Logger";
import Routes from "./Routes";
import Routing from "./Routing";

export default class Authentication {

    static login(username, password, errorCallback) {
        Ajax.post('j_spring_security_check', null, 'form')
            .send('username=' + username).send('password=' + password)
            .end((err, resp) => {
                if (err) {
                    errorCallback();
                    return;
                }
                const status = JSON.parse(resp.text);
                if (!status.success || !status.loggedIn) {
                    errorCallback(status);
                    return;
                }
                Actions.loadUser();
                Logger.log('User successfully authenticated.');
                Routing.transitionToOriginalTarget();
            });
    }

    static logout() {
        Ajax.post('j_spring_security_logout').end(function (err) {
            if (err) {
                Logger.error('Logout failed. Status: ' + err.status);
            } else {
                Logger.log('User successfully logged out.');
            }
            Routing.transitionTo(Routes.login);
            window.location.reload();
        });
    }
}
