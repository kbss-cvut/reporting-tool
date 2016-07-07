'use strict';

describe('Default form generator', () => {

    var Constants = require('../../js/constants/Constants'),
        DefaultFormGenerator = require('../../js/model/DefaultFormGenerator'),
        Generator = require('../environment/Generator').default,
        WizardGenerator = require('../../js/components/wizard/generator/WizardGenerator'),
        WizardStore = require('../../js/stores/WizardStore'),

        textValue;

    beforeEach(() => {
        spyOn(WizardStore, 'initWizard');
        textValue = 'masterchief';
    });

    it('generates empty one-step wizard as a default form', () => {
        var form = DefaultFormGenerator.generateForm(),
            wizardSteps = WizardGenerator._constructWizardSteps(form);

        expect(wizardSteps.length).toEqual(1);
        expect(WizardStore.initWizard).toHaveBeenCalledWith({root: form['@graph'][0]}, [form['@graph'][0][Constants.FORM.HAS_SUBQUESTION][0]]);
    });

    it('generates wizard with data for which report with QA was provided', () => {
        var event = {
                question: { // form
                    subQuestions: [{ // step
                        subQuestions: [{ // actuall question
                            answers: [{
                                textValue: textValue
                            }]
                        }]
                    }]
                }
            },

            form = DefaultFormGenerator.generateForm(event);

        var answer = form['@graph'][0][Constants.FORM.HAS_SUBQUESTION][0][Constants.FORM.HAS_SUBQUESTION][0][Constants.FORM.HAS_ANSWER];
        expect(answer).not.toBeNull();
        expect(answer[Constants.FORM.HAS_DATA_VALUE]).toEqual(textValue);
    });

    it('sets IDs of questions and answers from existing form values', () => {
        var event = {
                question: { // form
                    uri: Generator.getRandomUri(),
                    subQuestions: [{ // step
                        uri: Generator.getRandomUri(),
                        subQuestions: [{ // actuall question
                            uri: Generator.getRandomUri(),
                            answers: [{
                                uri: Generator.getRandomUri(),
                                textValue: textValue
                            }]
                        }]
                    }]
                }
            },

            form = DefaultFormGenerator.generateForm(event),
            rootQuestion = form['@graph'][0];
        expect(rootQuestion['@id']).toEqual(event.question.uri);
        expect(rootQuestion[Constants.FORM.HAS_SUBQUESTION][0]['@id']).toEqual(event.question.subQuestions[0].uri);
        expect(rootQuestion[Constants.FORM.HAS_SUBQUESTION][0][Constants.FORM.HAS_SUBQUESTION][0]['@id'])
            .toEqual(event.question.subQuestions[0].subQuestions[0].uri);
        expect(rootQuestion[Constants.FORM.HAS_SUBQUESTION][0][Constants.FORM.HAS_SUBQUESTION][0][Constants.FORM.HAS_ANSWER]['@id'])
            .toEqual(event.question.subQuestions[0].subQuestions[0].answers[0].uri);
    });

    it('creates a clone of the form template, so that modifications to the form do not affect the original template', () => {
        var formOne = DefaultFormGenerator.generateForm(), formTwo;
        formOne['newAttribute'] = 12345;
        formTwo = DefaultFormGenerator.generateForm();
        expect(formTwo['newAttribute']).not.toBeDefined();
    })
});
