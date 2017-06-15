'use strict';

import React from "react";
import assign from "object-assign";
import Attachments from "../../js/components/report/attachment/Attachments";
import Environment from "../environment/Environment";
import Generator from "../environment/Generator";

describe('Attachments', () => {

    var report,
        onChange;

    beforeEach(() => {
        report = Generator.generateOccurrenceReport();
        report.references = Generator.generateAttachments();
        onChange = jasmine.createSpy('onChange');
    });

    it('appends attachment on add', () => {
        let component = Environment.render(<Attachments report={report} onChange={onChange}/>),
            toAdd = {
                reference: 'http://added.attachment.com',
                description: 'Added attachment'
            };
        component._onAddAttachment(toAdd);
        expect(onChange).toHaveBeenCalled();
        expect(onChange.calls.argsFor(0)[0].references.length).toEqual(report.references.length + 1);
        // Position at the end
        expect(onChange.calls.argsFor(0)[0].references.indexOf(toAdd)).toEqual(report.references.length);
    });

    it('removes attachment on remove', () => {
        let component = Environment.render(<Attachments report={report} onChange={onChange}/>),
            toRemove = report.references[Generator.getRandomInt(report.references.length)];
        component._onRemoveAttachment(toRemove);
        expect(onChange).toHaveBeenCalled();
        expect(onChange.calls.argsFor(0)[0].references.length).toEqual(report.references.length - 1);
        expect(onChange.calls.argsFor(0)[0].references.indexOf(toRemove)).toEqual(-1);
    });

    it('merges attachment change on update', () => {
        let component = Environment.render(<Attachments report={report} onChange={onChange}/>),
            toUpdate = report.references[Generator.getRandomInt(report.references.length)],
            updated = assign({}, toUpdate);
        updated.reference = 'http://updated.reference.com';
        component._onUpdateAttachment(toUpdate, updated);
        expect(onChange).toHaveBeenCalled();
        expect(onChange.calls.argsFor(0)[0].references.indexOf(toUpdate)).toEqual(-1);
        expect(onChange.calls.argsFor(0)[0].references.indexOf(updated)).not.toEqual(-1);
    });
});
