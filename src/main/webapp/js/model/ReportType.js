'use strict';

const React = require('react');
const assign = require('object-assign');
const JsonLdUtils = require('jsonld-utils').default;
const CollapsibleText = require('../components/CollapsibleText');
const Constants = require('../constants/Constants');
const Vocabulary = require('../constants/Vocabulary');
const Utils = require('../utils/Utils');

class OccurrenceReport {
    constructor(data) {
        assign(this, data);
    }

    static getDetailController() {
        // Use require in method call to prevent circular dependencies with RevisionInfo
        return require('../components/report/occurrence/OccurrenceReportController');
    }

    getPhase(phaseMapping, intl) {
        if (!this.phase) {
            return '';
        }
        for (let i = 0, len = phaseMapping.length; i < len; i++) {
            if (phaseMapping[i]['@id'] === this.phase) {
                return JsonLdUtils.getLocalized(phaseMapping[i][Vocabulary.RDFS_LABEL], intl);
            }
        }
        return this.phase;
    }

    getPrimaryLabel() {
        return 'occurrencereport.label';
    }

    /**
     * Returns all the labels this report type supports.
     * @return {[string]}
     */
    getLabels() {
        return ['occurrencereport.label'];
    }

    toString() {
        return 'occurrencereport.title';
    }

    renderMoreInfo() {
        return <CollapsibleText text={Utils.stripHtmlTags(this.summary)}/>;
    }
}

const REPORT_TYPES = {};

REPORT_TYPES[Vocabulary.OCCURRENCE_REPORT] = OccurrenceReport;
REPORT_TYPES[Constants.OCCURRENCE_REPORT_JAVA_CLASS] = OccurrenceReport;

module.exports = {

    getDetailController: function (report) {
        return this._getReportClass(report).getDetailController();
    },

    getTypeLabel: function (type) {
        return REPORT_TYPES[type] ? new REPORT_TYPES[type]().getPrimaryLabel() : null;
    },

    getReport: function (data, suppressError) {
        const cls = this._getReportClass(data);
        if (!suppressError && !cls) {
            throw 'Unsupported report type ' + data;
        }
        return cls ? new cls(data) : null;
    },

    _getReportClass: function (data) {
        if (data.types) {
            for (let i = 0, len = data.types.length; i < len; i++) {
                if (REPORT_TYPES[data.types[i]]) {
                    return REPORT_TYPES[data.types[i]];
                }
            }
        }
        if (data.javaClass && REPORT_TYPES[data.javaClass]) {
            return REPORT_TYPES[data.javaClass];
        }
        return null;
    }
};
