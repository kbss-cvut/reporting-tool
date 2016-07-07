'use strict';

var Constants = require('../../../constants/Constants');
var DefaultFormGenerator = require('../../../model/DefaultFormGenerator');
var FormUtils = require('./FormUtils').default;
var I18nStore = require('../../../stores/I18nStore');
var JsonLdUtils = require('../../../utils/JsonLdUtils').default;
var Logger = require('../../../utils/Logger');
var Vocabulary = require('../../../constants/Vocabulary');
var GeneratedStep = require('./GeneratedStep').default;
var WizardStore = require('../../../stores/WizardStore');

var WizardGenerator = {

    generateWizard: function (report, event, wizardTitle, renderCallback) {
        this._createDefaultWizard(event, wizardTitle, renderCallback);
    },

    _createDefaultWizard: function (event, title, renderCallback) {
        var wizardProperties = {
            steps: this._constructWizardSteps(DefaultFormGenerator.generateForm(event)),
            title: title
        };
        renderCallback(wizardProperties);
    },

    _constructWizardSteps: function (structure) {
        var form = structure['@graph'],
            formElements,
            item,
            steps = [],
            i, len;

        for (i = 0, len = form.length; i < len; i++) {
            item = form[i];
            if (FormUtils.isForm(item)) {
                form = item;
                break;
            }
        }
        formElements = form[Constants.FORM.HAS_SUBQUESTION];
        if (!formElements) {
            Logger.error('Could not find any wizard steps in the received data.');
            throw 'No wizard steps in form';
        }
        for (i = 0, len = formElements.length; i < len; i++) {
            item = formElements[i];
            if (FormUtils.isWizardStep(item) && !FormUtils.isHidden(item)) {
                steps.push({
                    name: JsonLdUtils.getLocalized(item[Vocabulary.RDFS_LABEL], I18nStore.getIntl()),
                    component: GeneratedStep,
                    data: item
                });
            } else {
                Logger.warn('Item is not a wizard step: ' + item);
            }
        }
        // TODO Temporary sorting
        steps.sort(function (a, b) {
            if (a.name < b.name) {
                return 1;
            } else if (a.name > b.name) {
                return -1;
            }
            return 0;
        });
        WizardStore.initWizard({
            root: form
        }, steps.map((item) => {
            return item.data;
        }));
        return steps;
    }
};

module.exports = WizardGenerator;
