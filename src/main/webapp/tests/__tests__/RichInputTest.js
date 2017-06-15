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
