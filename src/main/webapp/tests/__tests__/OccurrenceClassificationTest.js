'use strict';

describe('Occurrence classification', () => {

    var React = require('react'),
        Environment = require('../environment/Environment'),
        Generator = require('../environment/Generator').default,
        OccurrenceClassification = require('../../js/components/report/occurrence/OccurrenceClassification'),
        OptionsStore = require('../../js/stores/OptionsStore'),
        JsonLdUtils = require('jsonld-utils').default,
        Actions = require('../../js/actions/Actions'),
        report, onChange;

    beforeEach(() => {
        report = {
            severityAssessment: 'http://onto.fel.cvut.cz/ontologies/eccairs-3.4.0.2/vl-a-431/v-200',
            occurrence: {}
        };
        onChange = jasmine.createSpy('onChange');
    });

    it('processes occurrence category options when getting them from store on init', () => {
        spyOn(OptionsStore, 'getOptions').and.returnValue(Generator.getJsonLdSample());
        spyOn(JsonLdUtils, 'processTypeaheadOptions').and.callThrough();
        Environment.render(<OccurrenceClassification report={report} onChange={onChange}/>);

        expect(JsonLdUtils.processTypeaheadOptions).toHaveBeenCalled();
    });

    it('processes occurrence category options when triggered from store on load', () => {
        spyOn(OptionsStore, 'getOptions').and.returnValue([]);
        spyOn(JsonLdUtils, 'processTypeaheadOptions').and.callThrough();
        Environment.render(<OccurrenceClassification report={report} onChange={onChange}/>);
        OptionsStore.trigger('occurrenceCategory', Generator.getJsonLdSample());

        expect(JsonLdUtils.processTypeaheadOptions).toHaveBeenCalledWith(Generator.getJsonLdSample());
    });
});
