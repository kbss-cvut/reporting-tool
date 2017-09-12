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
import {IfGranted} from "react-authorization";
import UsersController from "./UsersController";
import UserStore from "../../stores/UserStore";
import Vocabulary from "../../constants/Vocabulary";

const Administration = () => {
    // Wrap it all up in IfGranted to make sure that unauthorized users are not able to view anything even if they are able
    // to get the component to render (e.g. by setting route URL manually)

    const user = UserStore.getCurrentUser();
    return <IfGranted expected={Vocabulary.ROLE_ADMIN} actual={user ? user.types : []}>
        <UsersController/>
    </IfGranted>;
};

export default Administration;
