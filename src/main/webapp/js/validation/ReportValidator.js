'use strict';

var Constants = require('../constants/Constants');

var ReportValidator = {

    /**
     * Checks whether 376 fields are filled.
     * @param report Report to validate
     * @return {boolean} Validity status
     */
    isValid: function (report) {
        return this.getValidationMessage(report) === null;
    },

    /**
     * Gets I18N property corresponding to the result of validation of the specified report.
     *
     * I.e., when the report is missing some property value, a message about missing required fields is returned, if
     * any
     * of the report values is invalid, then a message about the invalid property value is returned. Null is returned
     * for a valid report.
     * @param report Report to validate
     * @return {*} Message identifier or null
     */
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
        if (!this._isOccurrenceStartEndTimeDiffValid(report)) {
            return 'detail.large-time-diff-tooltip';
        }
        // More checks can be added
        return null;
    }
};

module.exports = ReportValidator;
