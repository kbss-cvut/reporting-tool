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
