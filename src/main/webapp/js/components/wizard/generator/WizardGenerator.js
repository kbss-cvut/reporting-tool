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
