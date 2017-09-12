/*
 * Copyright (C) 2017 Czech Technical University in Prague
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
