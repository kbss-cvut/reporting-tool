'use strict';

var InitialReport = require('./InitialReport');
var I18nStore = require('../../stores/I18nStore');

module.exports = [{
    component: InitialReport,
    name: I18nStore.i18n('initial.label'),
    defaultNextDisabled: true
}];
