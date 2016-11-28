'use strict';

var Constants = require('../constants/Constants');

var validators = {};

var ReportValidator = {

    /**
     * Checks whether all the required fields are filled.
     * @param report Report to validate
     * @return {boolean} Validity status
     */
    isValid: function (report) {
        return this.getValidationMessage(report) === null;
    },

    getValidationMessage: function (report) {
        if (validators[report.javaClass]) {
            return validators[report.javaClass].getValidationMessage(report);
        }
        return null;
    },

    /**
     * Checks whether the application will be able to render the specified report.
     *
     * For instance, reports with too large difference between occurrence start and end time cannot be rendered, because
     * the gantt component hangs when trying to render such data and it causes the whole browser to freeze.
     * @param report The report to check
     */
    canRender: function (report) {
        return this.getRenderError(report) === null;
    },

    /**
     * Gets error because of which the specified report cannot be rendered.
     * @param report The report to check
     * @return {*} Error message identifier, or {@code null}, if the report can be rendered
     */
    getRenderError: function (report) {
        if (!report) {
            return '';
        }
        if (validators[report.javaClass]) {
            return validators[report.javaClass].getRenderError(report);
        }
        return null;
    }
};

/**
 * Occurrence report validator.
 */
var OccurrenceReportValidator = {

    getValidationMessage: function (report) {
        if (!report.occurrence) {
            return 'detail.invalid-tooltip';
        }
        if (!report.occurrence.name || report.occurrence.name.length === 0) {
            return 'detail.invalid-tooltip';
        }
        if (!report.occurrence.startTime) {
            return 'detail.invalid-tooltip';   // Don't expect this to happen, but just to be sure
        }
        if (!report.severityAssessment) {
            return 'detail.invalid-tooltip';
        }
        if (!report.summary || report.summary.length === 0) {
            return 'detail.invalid-tooltip';
        }
        if (!report.occurrence.eventType) {
            return 'detail.invalid-tooltip';
        }
        if (!this._isOccurrenceStartEndTimeDiffValid(report)) {
            return 'detail.large-time-diff-tooltip';
        }
        return null;
    },

    _isOccurrenceStartEndTimeDiffValid: function (report) {
        return report.occurrence.endTime - report.occurrence.startTime <= Constants.MAX_OCCURRENCE_START_END_DIFF;
    },

    getRenderError: function (report) {
        if (!this._isOccurrenceStartEndTimeDiffValid(report)) {
            return 'detail.large-time-diff-tooltip';
        }
        // More checks can be added
        return null;
    }
};

validators[Constants.OCCURRENCE_REPORT_JAVA_CLASS] = OccurrenceReportValidator;

module.exports = ReportValidator;
