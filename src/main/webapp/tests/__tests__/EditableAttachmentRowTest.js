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
import ReactDOM from "react-dom";
import TestUtils from "react-addons-test-utils";
import {Button} from "react-bootstrap";
import Environment from "../environment/Environment";
import EditableAttachmentRow from "../../js/components/report/attachment/EditableAttachmentRow";

describe('Editable attachment row', () => {

    let onSave, onCancel;

    beforeEach(() => {
        onSave = jasmine.createSpy('onSave');
        onCancel = jasmine.createSpy('onCancel');
    });

    it('renders save button disabled when attachment value is empty', () => {
        const attachment = {
                reference: '',
                description: ''
            },
            component = Environment.renderIntoTable(<EditableAttachmentRow attachment={attachment} onSave={onSave}
                                                                           onCancel={onCancel}/>),
            buttons = TestUtils.scryRenderedComponentsWithType(component, Button),
            button = ReactDOM.findDOMNode(buttons[0]);
        expect(button.disabled).toBeTruthy();
    });
});
