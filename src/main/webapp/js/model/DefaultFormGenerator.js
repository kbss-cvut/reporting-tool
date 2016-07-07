'use strict';

var Constants = require('../constants/Constants');

module.exports = {

    /**
     * Generates default form for the wizard framework.
     *
     * The form consists of a single step, which contains one text area for the description.
     */
    generateForm(event) {
        var formTemplate = require('./defaultForm.json');
        // Deep copy of the form template to prevent modifications
        formTemplate = JSON.parse(JSON.stringify(formTemplate));
        if (!event || !event.question) {
            return formTemplate;
        }
        var form = formTemplate['@graph'][0],
            formStep = form[Constants.FORM.HAS_SUBQUESTION][0],
            stepQuestion = formStep[Constants.FORM.HAS_SUBQUESTION][0],
            questionAnswer = stepQuestion[Constants.FORM.HAS_ANSWER],

            step = event.question.subQuestions ? event.question.subQuestions[0] : null;
        form['@id'] = event.question.uri;
        if (!step) {
            return formTemplate;
        }
        formStep['@id'] = step.uri;
        var question = step.subQuestions ? step.subQuestions[0] : null;
        if (!question) {
            return formTemplate;
        }
        stepQuestion['@id'] = question.uri;
        var answer = question.answers ? question.answers[0] : {};
        questionAnswer['@id'] = answer.uri;
        questionAnswer[Constants.FORM.HAS_DATA_VALUE] = answer.textValue;
        return formTemplate;
    }
};
