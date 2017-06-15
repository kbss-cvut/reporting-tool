'use strict';

var Routes = {

    login: {name: 'login', path: 'login'},
    register: {name: 'register', path: 'register'},
    dashboard: {name: 'dashboard', path: 'dashboard'},
    reports: {name: 'reports', path: 'reports'},
    statistics: {name: 'statistics', path: 'statistics'},
    createReport: {name: 'createReport', path: 'reports/create'},
    editReport: {name: 'editReport', path: 'reports/:reportKey'},
    searchResults: {name: 'searchResults', path: 'search'}
};

module.exports = Routes;
