'use strict';

var Reflux = require('reflux');

var Actions = Reflux.createActions([
    'loadUser',

    'loadAllReports', 'deleteReportChain', 'createReport', 'updateReport', 'submitReport',
    'phaseTransition',
    'loadRevisions', 'loadReport',

    'loadOptions',

    'setTransitionPayload',
    
    'rememberComponentState', 'resetComponentState',

    'loadFormOptions',

    'loadStatistics',

    'publishMessage',

    'fullTextSearch'
]);

module.exports = Actions;
