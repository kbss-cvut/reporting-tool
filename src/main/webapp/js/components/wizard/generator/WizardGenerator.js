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
