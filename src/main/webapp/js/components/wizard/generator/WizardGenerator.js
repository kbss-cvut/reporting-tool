'use strict';

const Configuration = require('semforms').Configuration;
const WizardGenerator = require('semforms').WizardGenerator;

const Ajax = require('../../../utils/Ajax');
const Actions = require('../../../actions/Actions');
const FormGenStore = require('../../../stores/FormGenStore');
const I18nStore = require('../../../stores/I18nStore');
const JsonReferenceResolver = require('../../../utils/JsonReferenceResolver').default;
const Logger = require('../../../utils/Logger');
const Input = require('../../Input').default;
const TypeaheadResultList = require('../../typeahead/TypeaheadResultList');
const Utils = require('../../../utils/Utils');
const WizardStore = require('../../../stores/WizardStore');

const EVENT_PARAM = 'event';
const EVENT_TYPE_PARAM = 'eventType';
const FORM_GEN_URL = 'rest/formGen';

module.exports = {

    generateSummaryWizard: function (report, wizardTitle, renderCallback) {
        JsonReferenceResolver.encodeReferences(report);
        Ajax.post(FORM_GEN_URL, report).end((data) => {
            Configuration.actions = Actions;
            Configuration.wizardStore = WizardStore;
            Configuration.optionsStore = FormGenStore;
            Configuration.intl = I18nStore.getIntl();
            Configuration.typeaheadResultList = TypeaheadResultList;
            Configuration.inputComponent = Input;
            WizardGenerator.createWizard(data, {}, wizardTitle, renderCallback);
        }, () => {
            Logger.log('Received no valid wizard. Using the default one.');
            WizardGenerator.createDefaultWizard({}, wizardTitle, renderCallback);
        });
    },

    generateWizard: function (report, event, wizardTitle, renderCallback) {
        const url = this._initUrlWithParameters(event);
        JsonReferenceResolver.encodeReferences(report);
        Ajax.post(url, report).end((data) => {
            Configuration.actions = Actions;
            Configuration.wizardStore = WizardStore;
            Configuration.optionsStore = FormGenStore;
            Configuration.intl = I18nStore.getIntl();
            Configuration.typeaheadResultList = TypeaheadResultList;
            Configuration.inputComponent = Input;
            WizardGenerator.createWizard(data, event.question, wizardTitle, renderCallback);
        }, () => {
            Logger.log('Received no valid wizard. Using the default one.');
            WizardGenerator.createDefaultWizard(event.question, wizardTitle, renderCallback);
        });
    },

    _initUrlWithParameters: function (event) {
        const params = {};
        if (event.eventTypes) {
            params[EVENT_TYPE_PARAM] = encodeURIComponent(event.eventTypes[0]);
        }
        params[EVENT_PARAM] = event.referenceId;
        return Utils.addParametersToUrl(FORM_GEN_URL, params);
    }
};
