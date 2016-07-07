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

import Constants from "../../../constants/Constants";
import Utils from "../../../utils/Utils";

export default class FormUtils {

    static isForm(structure) {
        return Utils.hasValue(structure, Constants.FORM.LAYOUT_CLASS, Constants.FORM.LAYOUT.FORM);
    }

    static isWizardStep(structure) {
        return Utils.hasValue(structure, Constants.FORM.LAYOUT_CLASS, Constants.FORM.LAYOUT.WIZARD_STEP);
    }

    static isSection(question) {
        return Utils.hasValue(question, Constants.FORM.LAYOUT_CLASS, Constants.FORM.LAYOUT.QUESTION_SECTION);
    }

    static isTypeahead(question) {
        return Utils.hasValue(question, Constants.FORM.LAYOUT_CLASS, Constants.FORM.LAYOUT.QUESTION_TYPEAHEAD);
    }

    static getPossibleValuesQuery(question) {
        return Utils.getJsonAttValue(question, Constants.FORM.HAS_OPTIONS_QUERY);
    }

    static isDisabled(question) {
        return Utils.hasValue(question, Constants.FORM.LAYOUT_CLASS, Constants.FORM.LAYOUT.DISABLED);
    }

    static isHidden(question) {
        return Utils.hasValue(question, Constants.FORM.LAYOUT_CLASS, Constants.FORM.LAYOUT.HIDDEN);
    }

    static isTextarea(question, answerValue) {
        return answerValue && answerValue.length > Constants.INPUT_LENGTH_THRESHOLD
            || Utils.hasValue(question, Constants.FORM.LAYOUT_CLASS, Constants.FORM.LAYOUT.TEXTAREA);
    }
    
    static resolveValue(answer) {
        if (!answer) {
            return null;
        }
        if (answer[Constants.FORM.HAS_OBJECT_VALUE]) {
            return answer[Constants.FORM.HAS_OBJECT_VALUE]['@id'];
        } else {
            return Utils.getJsonAttValue(answer, Constants.FORM.HAS_DATA_VALUE);
        }
    }
}
