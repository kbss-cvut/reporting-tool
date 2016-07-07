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
