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
import TestUtils from "react-addons-test-utils";
import Environment from "../environment/Environment";
import Generator from "../environment/Generator";
import Actions from "../../js/actions/Actions";
import Administration from "../../js/components/admin/Administration";
import UserStore from "../../js/stores/UserStore";
import Vocabulary from "../../js/constants/Vocabulary";

class Wrapper extends React.Component {
    render() {
        return this.props.children;
    }
}

describe('Administration', () => {

    beforeEach(() => {
        spyOn(Actions, 'loadUser');
        spyOn(Actions, 'loadUsers');
    });

    it('does not display users if current user is not admin', () => {
        const user = Generator.generatePerson();
        user.types = [];
        spyOn(UserStore, 'getCurrentUser').and.returnValue(user);

        const component = Environment.render(<Wrapper><Administration/></Wrapper>),
            usersComp = TestUtils.scryRenderedComponentsWithType(component, require('../../js/components/admin/UsersController').default);
        expect(usersComp.length).toEqual(0);
    });

    it('displays users if current user is admin', () => {
        const user = Generator.generatePerson();
        user.types = [Vocabulary.ROLE_ADMIN];
        spyOn(UserStore, 'getCurrentUser').and.returnValue(user);

        const component = Environment.render(<Wrapper><Administration/></Wrapper>),
            usersComp = TestUtils.findRenderedComponentWithType(component, require('../../js/components/admin/UsersController').default);
        expect(usersComp).not.toBeNull();
    });
});
