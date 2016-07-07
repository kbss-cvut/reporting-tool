'use strict';

var Routes = require('../utils/Routes');

module.exports = {
    APP_NAME: 'Reporting Tool',
    ECCAIRS_URL: 'http://www.icao.int/safety/airnavigation/AIG/Documents/ADREP%20Taxonomy/ECCAIRS%20Aviation%201.3.0.12%20(Entities%20and%20Attributes).en.id.pdf',
    HOME_ROUTE: Routes.dashboard,
    OPTIONS: {
        OCCURRENCE_CLASS: 'occurrenceClass'
    },

    /**
     * Sorting glyph icons
     */
    SORTING: {
        NO: {glyph: 'sort', title: 'sort.no'},
        ASC: {glyph: 'chevron-up', title: 'sort.asc'},
        DESC: {glyph: 'chevron-down', title: 'sort.desc'}
    },

    UNAUTHORIZED_USER: {name: 'unauthorized'},

    FILTER_DEFAULT: 'all',

    DASHBOARDS: {
        MAIN: {
            id: 'main',
            title: 'dashboard.welcome'
        },
        CREATE_REPORT: {
            id: 'createReport',
            title: 'dashboard.create-tile'
        },
        IMPORT_REPORT: {
            id: 'importReport',
            title: 'dashboard.create-import-tile'
        }
    },

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

    // Maximum time difference between occurrence start and end. 24 hours in millis
    MAX_OCCURRENCE_START_END_DIFF: 1000 * 60 * 60 * 24,

    // Maximum input value length, for which input of type text should be displayed
    INPUT_LENGTH_THRESHOLD: 70,

    OCCURRENCE_JAVA_CLASS: 'cz.cvut.kbss.reporting.dto.event.OccurrenceDto',
    EVENT_JAVA_CLASS: 'cz.cvut.kbss.reporting.dto.event.EventDto',
    OCCURRENCE_REPORT_JAVA_CLASS: 'cz.cvut.kbss.reporting.dto.OccurrenceReportDto',

    // Form Generator
    FORM: {
        FORM: 'http://onto.fel.cvut.cz/ontologies/documentation/form',
        HAS_SUBQUESTION: 'http://onto.fel.cvut.cz/ontologies/documentation/has_related_question',
        HAS_ANSWER: 'http://onto.fel.cvut.cz/ontologies/documentation/has_answer',
        HAS_OPTION: 'http://onto.fel.cvut.cz/ontologies/form/has-possible-value',
        HAS_OPTIONS_QUERY: 'http://onto.fel.cvut.cz/ontologies/form/has-possible-values-query',
        HAS_VALUE_TYPE: 'http://onto.fel.cvut.cz/ontologies/form/has-value-type',
        IS_DISABLED: 'http://onto.fel.cvut.cz/ontologies/aviation/form-376/is-disabled',
        LAYOUT_CLASS: 'http://onto.fel.cvut.cz/ontologies/form-layout/has-layout-class',
        LAYOUT: {
            FORM: 'form',
            QUESTION_TYPEAHEAD: 'type-ahead',
            QUESTION_SECTION: 'section',
            WIZARD_STEP: 'wizard-step',
            DISABLED: 'disabled',
            HIDDEN: 'hidden',
            TEXTAREA: 'textarea'
        },
        VALUE_TYPE_CODE: 'code',
        VALUE_TYPE_TEXT: 'text',
        GENERATED_ROW_SIZE: 1,

        HAS_QUESTION_ORIGIN: 'http://onto.fel.cvut.cz/ontologies/form/has-question-origin',
        HAS_ANSWER_ORIGIN: 'http://onto.fel.cvut.cz/ontologies/form/has-answer-origin',

        HAS_DATA_VALUE: 'http://onto.fel.cvut.cz/ontologies/documentation/has_data_value',
        HAS_OBJECT_VALUE: 'http://onto.fel.cvut.cz/ontologies/documentation/has_object_value'
    }
};
