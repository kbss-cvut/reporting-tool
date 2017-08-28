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
