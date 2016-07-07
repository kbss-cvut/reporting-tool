/*
 * Copyright (C) 2016 Czech Technical University in Prague
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
