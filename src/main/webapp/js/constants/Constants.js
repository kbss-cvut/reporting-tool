'use strict';

const Routes = require('../utils/Routes');

module.exports = {
    APP_NAME: 'INBAS Reporting Tool',
    ECCAIRS_URL: 'http://www.icao.int/safety/airnavigation/AIG/Documents/ADREP%20Taxonomy/ECCAIRS%20Aviation%201.3.0.12%20(Entities%20and%20Attributes).en.id.pdf',
    HOME_ROUTE: Routes.dashboard,
    OPTIONS: {
        OCCURRENCE_CLASS: 'occurrenceClass',
        OCCURRENCE_CATEGORY: 'occurrenceCategory',
        EVENT_TYPE: 'eventType',
        REPORTING_PHASE: 'reportingPhase',
        FACTOR_TYPE: 'factorType'
    },

    TIME_SCALES: {
        SECOND: 'second',
        MINUTE: 'minute',
        HOUR: 'hour',
        RELATIVE: 'relative'
    },
    TIME_SCALE_THRESHOLD: 100,

    /**
     * Types of message published by the MessageStore
     */
    MESSAGE_TYPE: {
        SUCCESS: 'success',
        INFO: 'info',
        WARNING: 'warning',
        ERROR: 'danger'
    },
    /**
     * Duration for which a message is by default displayed by the messaging UI.
     */
    MESSAGE_DURATION: 5000,

    /**
     * Sorting glyph icons
     */
    SORTING: {
        NO: {glyph: 'sort', title: 'sort.no'},
        ASC: {glyph: 'sort-by-$type$', title: 'sort.asc'},
        DESC: {glyph: 'sort-by-$type$-alt', title: 'sort.desc'}
    },

    UNAUTHORIZED_USER: {name: 'unauthorized'},

    FILTER_DEFAULT: 'all',

    /**
     * Navigation between dashboards. Key is the current dashboard, value is the target to navigate to on goBack
     */
    DASHBOARD_GO_BACK: {
        'main': 'main',
        'createReport': 'main',
        'importReport': 'createReport'
    },

    MINUTE: 60 * 1000,   // Minute in milliseconds

    // Maximum number of columns supported by Bootstrap
    COLUMN_COUNT: 12,

    // Default page size (used by the PagingMixin)
    PAGE_SIZE: 20,

    // Maximum time difference between occurrence start and end. 24 hours in millis
    MAX_OCCURRENCE_START_END_DIFF: 1000 * 60 * 60 * 24,

    // Maximum input value length, for which input of type text should be displayed
    INPUT_LENGTH_THRESHOLD: 70,

    OCCURRENCE_JAVA_CLASS: 'cz.cvut.kbss.reporting.dto.event.OccurrenceDto',
    EVENT_JAVA_CLASS: 'cz.cvut.kbss.reporting.dto.event.EventDto',
    OCCURRENCE_REPORT_JAVA_CLASS: 'cz.cvut.kbss.reporting.dto.OccurrenceReportDto',

    FULL_TEXT_SEARCH_OPTION: {
        id: 'full-text-search',
        identification: 'Full text search'
    },

    FILTERS: [{
        path: 'occurrenceCategory',
        type: 'select',
        options: 'occurrenceCategory',
        label: 'report.occurrence.category.label'
    }, {
        path: 'phase',
        type: 'select',
        options: 'reportingPhase',
        label: 'reports.phase'
    }]
};
