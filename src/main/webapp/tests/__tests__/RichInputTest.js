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
import Environment from "../environment/Environment";
import RichInput from "../../js/components/misc/RichInput";

describe('RichInput', () => {

    let onChange;

    beforeEach(() => {
        onChange = jasmine.createSpy('onChange');
    });

    it('renders HTML-based value', () => {
        const text = 'Test value using HTML tags.',
            htmlBased = '<p>Test <b>value</b> using <em>HTML</em> tags.</p>';
        const component = Environment.render(<RichInput onChange={onChange} value={htmlBased}/>),
            editorState = component.state.editorState;
        expect(editorState).not.toBeNull();
        expect(editorState.getCurrentContent().getPlainText()).toEqual(text);
    });

    it('renders plain-text value', () => {
        const value = 'Plain text value without any HTML features.',
            component = Environment.render(<RichInput onChange={onChange} value={value}/>),
            editorState = component.state.editorState;
        expect(editorState).not.toBeNull();
        expect(editorState.getCurrentContent().getPlainText()).toEqual(value);
    });

    it('renders empty value', () => {
        const component = Environment.render(<RichInput onChange={onChange} value={''}/>),
            editorState = component.state.editorState;
        expect(editorState).not.toBeNull();
        expect(editorState.getCurrentContent().getPlainText()).toEqual('');
    });

    it('renders undefined value as empty string', () => {
        const component = Environment.render(<RichInput onChange={onChange} value={undefined}/>),
            editorState = component.state.editorState;
        expect(editorState).not.toBeNull();
        expect(editorState.getCurrentContent().getPlainText()).toEqual('');
    })
});
