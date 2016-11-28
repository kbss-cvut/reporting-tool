'use strict';

var Description = require('./Description');
var I18nStore = require('../../../stores/I18nStore');

module.exports = [
    {
        name: I18nStore.i18n('report.corrective.wizard.step-title'),
        component: Description,
        defaultNextDisabled: true
    }
];
