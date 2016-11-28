'use strict';

var Configuration = require('semforms').Configuration;
var WizardGenerator = require('semforms').WizardGenerator;

var Actions = require('../../../actions/Actions');
var FormGenStore = require('../../../stores/FormGenStore');
var I18nStore = require('../../../stores/I18nStore');
var Input = require('../../Input').default;
var TypeaheadResultList = require('../../typeahead/TypeaheadResultList');
var WizardStore = require('../../../stores/WizardStore');

module.exports = {

    generateWizard: function (report, event, wizardTitle, renderCallback) {
        Configuration.actions = Actions;
        Configuration.wizardStore = WizardStore;
        Configuration.optionsStore = FormGenStore;
        Configuration.intl = I18nStore.getIntl();
        Configuration.typeaheadResultList = TypeaheadResultList;
        Configuration.inputComponent = Input;
        WizardGenerator.createDefaultWizard(event.question, wizardTitle, renderCallback);
    }
};
