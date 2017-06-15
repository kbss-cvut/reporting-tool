'use strict';

import React from "react";
import TestUtils from "react-addons-test-utils";
import AttachmentTable from "../../js/components/report/attachment/AttachmentTable";
import EditableAttachmentRow from "../../js/components/report/attachment/EditableAttachmentRow";
import Environment from "../environment/Environment";
import Generator from "../environment/Generator";

describe('Attachment table', () => {

    let attachments,
        onChange,
        onRemove;

    beforeEach(() => {
        attachments = Generator.generateAttachments();
        onChange = jasmine.createSpy('onChange');
        onRemove = jasmine.createSpy('onRemove');
    });

    it('renders editable row when edit is triggered on an attachment', () => {
        let component = Environment.render(<AttachmentTable onChange={onChange} onRemove={onRemove}
                                                            attachments={attachments}/>),
            edited = attachments[Generator.getRandomInt(attachments.length)],

            editedRows = TestUtils.scryRenderedComponentsWithType(component, EditableAttachmentRow.WrappedComponent);
        expect(editedRows.length).toEqual(0);
        component._onEdit(edited);

        editedRows = TestUtils.scryRenderedComponentsWithType(component, EditableAttachmentRow.WrappedComponent);
        expect(editedRows.length).toEqual(1);
    });

    it('removes editable row when edit cancel is clicked in it', () => {
        let component = Environment.render(<AttachmentTable onChange={onChange} onRemove={onRemove}
                                                            attachments={attachments}/>),
            edited = attachments[Generator.getRandomInt(attachments.length)];
        component._onEdit(edited);

        let editedRow = TestUtils.findRenderedComponentWithType(component, EditableAttachmentRow.WrappedComponent),
            cancelEditButton = TestUtils.scryRenderedDOMComponentsWithTag(editedRow, 'button')[1];
        TestUtils.Simulate.click(cancelEditButton);

        expect(TestUtils.scryRenderedComponentsWithType(component, EditableAttachmentRow.WrappedComponent).length).toEqual(0);
    });

    it('removes editable row and passes update to change handler when edit is finished', () => {
        let component = Environment.render(<AttachmentTable onChange={onChange} onRemove={onRemove}
                                                            attachments={attachments}/>),
            edited = attachments[Generator.getRandomInt(attachments.length)];
        component._onEdit(edited);

        let editedRow = TestUtils.findRenderedComponentWithType(component, EditableAttachmentRow.WrappedComponent),
            saveEditButton = TestUtils.scryRenderedDOMComponentsWithTag(editedRow, 'button')[0];
        TestUtils.Simulate.click(saveEditButton);

        expect(onChange).toHaveBeenCalled();
        expect(TestUtils.scryRenderedComponentsWithType(component, EditableAttachmentRow.WrappedComponent).length).toEqual(0);
    });

    it('removes editable row when row was added in properties', () => {
        let TestParent = React.createClass({
            getInitialState() {
                return {attachments: attachments};
            },
            render() {
                return <AttachmentTable onChange={onChange} onRemove={onRemove} attachments={this.state.attachments}/>;
            }
        });
        let parent = Environment.render(<TestParent/>),
            component = TestUtils.findRenderedComponentWithType(parent, AttachmentTable.WrappedComponent),
            edited = attachments[Generator.getRandomInt(attachments.length)];
        component.getWrappedComponent()._onEdit(edited);
        parent.setState({attachments: attachments.concat([{reference: 'http://test'}])});
        expect(TestUtils.scryRenderedComponentsWithType(component, EditableAttachmentRow.WrappedComponent).length).toEqual(0);
    });

    it('renders attachments with URL as link', () => {
        attachments = [{reference: 'http://testfile.com'}, {reference: 'https://securetestfile.com'}, {reference: 'ftp://ftpfile.com'},
            {reference: 'ftps://secureftpfile.com'}, {reference: '/opt/data/file1.txt'}];
        let component = Environment.render(<AttachmentTable onChange={onChange} onRemove={onRemove}
                                                            attachments={attachments}/>),
            rows = TestUtils.scryRenderedDOMComponentsWithTag(component, 'tr'),
            lnk;
        expect(rows.length).toEqual(attachments.length + 1);    // + 1 - the header row
        for (let i = 1, len = rows.length - 1; i < len; i++) {
            lnk = rows[i].firstChild.firstChild;
            expect(lnk.tagName.toLowerCase()).toEqual('a');
        }
        expect(rows[rows.length - 1].firstChild.firstChild.nodeType).toEqual(3);    // Text node
    });
});
